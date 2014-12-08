
/**
 * Module dependencies.
 */

var assert = require('assert');
var ListCommand = require('../');

describe('ListCommand', function () {
  var div;

  afterEach(function () {
    if (div) {
      // clean up...
      document.body.removeChild(div);
      div = null;
    }
  });

  describe('new ListCommand("ul")', function () {

    it('should create a `ListCommand` instance', function () {
      var list = new ListCommand('ul');

      assert(list instanceof ListCommand);
      assert(list.nodeName === 'ul');
      assert(list.document === document);
    });

    it('should throw a TypeError if no node name is specified', function () {
      try {
        new ListCommand();
        assert(false); // unreachable
      } catch (e) {
        assert.equal('TypeError', e.name);
        assert(/.ul. or .ol. must be provided/.test(e.message));
      }
    });

    describe('execute()', function () {

      it('should insert a UL node around block at current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild, 2);
        assert(!range.collapsed);
        assert.equal('e', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>hello</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert.equal('e', sel.getRangeAt(0).toString());
      });

      it('should insert a UL node around block at collapsed Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello world</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 8);
        range.setEnd(div.firstChild.firstChild, 8);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>hello world</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert(sel.getRangeAt(0).collapsed);
        assert(sel.getRangeAt(0).startContainer === div.firstChild.firstChild.firstChild);
        assert(sel.getRangeAt(0).startOffset === 8);
        assert(sel.getRangeAt(0).endContainer === div.firstChild.firstChild.firstChild);
        assert(sel.getRangeAt(0).endOffset === 8);
      });

    });

    describe('queryState()', function () {

      it('should return `false` when no UL is present around Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>hello</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 3);
        range.setEnd(div.firstChild.firstChild, 3);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        assert.equal(false, list.queryState());
      });

      it('should return `true` when a UL is present around Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>hello</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 3);
        range.setEnd(div.firstChild.firstChild.firstChild, 3);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        assert.equal(true, list.queryState());
      });

    });

  });

});
