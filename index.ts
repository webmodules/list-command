/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import AbstractCommand = require('abstract-command');
import closest = require('component-closest');
import contains = require('node-contains');
import DomIterator = require('dom-iterator');
import blockElements = require('block-elements');
import saveRange = require('save-range');
import DEBUG = require('debug');

var debug = DEBUG('list-command');
var blockSel = blockElements.join(', ');

/**
 * Cross-browser `insertOrderedList` and `insertUnorderedList` command
 * implementations. Pass in "ol" or "ul" for the for ordered or unordered
 * lists, respectively.
 *
 * ``` js
 * var ol = new ListCommand('ol');
 * ol.execute();
 * ```
 *
 * @public
 */

class ListCommand extends AbstractCommand {
  nodeName: string;

  constructor(nodeName: string, doc: Document = document) {
    if (!nodeName) throw new TypeError('"ul" or "ol" must be provided as the node name');
    super(doc);
    this.nodeName = String(nodeName).toLowerCase();
    debug('created ListCommand: nodeName %o', nodeName);
  }

  protected _execute(range: Range, value?: any): void {
    var li: HTMLElement;
    var list: HTMLElement;
    var block: HTMLElement;
    var info: saveRange.Info;
    var next: Node = range.startContainer;
    var end: Node = range.endContainer;
    var iterator = new DomIterator(next).revisit(false);
    var blocks: HTMLElement[] = [];

    if (this._queryState(range)) {
      // unwrap list

      while (next) {
        var node: HTMLElement = closest(next, 'li', true);
        if (-1 === blocks.indexOf(node)) blocks.push(node);
        if (contains(end, next)) break;
        next = iterator.next(3 /* Node.TEXT_NODE */);
      }

      debug('need to unwrap %o LI elements from %o list', blocks.length, this.nodeName);
      if (blocks.length > 0) {
        info = saveRange(range, this.document);

        li = blocks[0];
        list = <HTMLElement>closest(li, this.nodeName);
        var parent = <HTMLElement>list.parentNode;
        var fragment = this.document.createDocumentFragment();

        var nextSibling;
        if (li === list.firstChild) {
          // insert before
          nextSibling = list;
        } else if (blocks[blocks.length - 1] === list.lastChild) {
          // insert after
          nextSibling = list.nextSibling;
        } else {
          // TODO: handle the "middle split UL/OL" case
        }

        for (var i = 0; i < blocks.length; i++) {
          li = blocks[i];
          block = this.document.createElement('p');

          fragment.appendChild(block);

          parent.insertBefore(fragment, nextSibling);

          // transfer LI children to new P element
          while (li.firstChild) block.appendChild(li.firstChild);

          // remove empty LI element
          li.parentNode.removeChild(li);
        }

        // if there are no more elements in the UL/OL, then remove it from the DOM
        if (!list.firstChild) parent.removeChild(list);

        saveRange.load(info, parent);
      }

    } else {
      // wrap list

      while (next) {
        var node: HTMLElement = closest(next, blockSel, true);
        if (-1 === blocks.indexOf(node)) blocks.push(node);
        if (contains(end, next)) break;
        next = iterator.next(3 /* Node.TEXT_NODE */);
      }

      debug('need to wrap %o block elements into a %o list', blocks.length, this.nodeName);
      if (blocks.length > 0) {
        info = saveRange(range, this.document);

        // create new `nodeName` list element and insert before first "block"
        list = this.document.createElement(this.nodeName);
        block = blocks[0];
        block.parentNode.insertBefore(list, block);

        for (var i = 0; i < blocks.length; i++) {
          li = this.document.createElement('li');
          block = blocks[i];
          list.appendChild(li);
          while (block.firstChild) li.appendChild(block.firstChild);
          block.parentNode.removeChild(block);
        }

        saveRange.load(info, list);
      }

    }
  }

  protected _queryState(range: Range): boolean {
    var next: Node = range.startContainer;
    var end: Node = range.endContainer;
    var iterator = new DomIterator(next).revisit(false);

    while (next) {
      var node: Node = closest(next, this.nodeName, true);
      if (!node) return false;
      if (contains(end, next)) break;
      next = iterator.next(3 /* Node.TEXT_NODE */);
    }

    return true;
  }
}

export = ListCommand;
