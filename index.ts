/// <reference path='types.d.ts' />

/**
 * TypeScript dependencies.
 */

import AbstractCommand = require('abstract-command');
import closest = require('component-closest');
import contains = require('node-contains');
import DomIterator = require('dom-iterator');
import DEBUG = require('debug');

var debug = DEBUG('list-command');

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
    if (this._queryState(range)) {
      // unwrap list
    } else {
      // wrap list
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
