
/**
 * Module dependencies.
 */

var assert = require('assert');
var contains = require('node-contains');
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

      it('should insert a UL node around multiple blocks at current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>one</p><p>two</p><p>three</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild, 1);
        range.setEnd(div.lastChild.firstChild, 1);
        assert(!range.collapsed);
        assert.equal('netwot', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li><li>two</li><li>three</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert.equal('netwot', sel.getRangeAt(0).toString());
      });

      it('should insert a UL node around middle block at current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>one</p><p>two</p><p>three</p><p>four</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.childNodes[1].firstChild, 1);
        range.setEnd(div.childNodes[2].firstChild, 1);
        assert(!range.collapsed);
        assert.equal('wot', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<p>one</p><ul><li>two</li><li>three</li></ul><p>four</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert.equal('wot', sel.getRangeAt(0).toString());
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
        range = sel.getRangeAt(0);

        var li = div.firstChild.firstChild;
        assert(range.collapsed);
        assert(contains(li, range.startContainer));
        assert(contains(li, range.endContainer));
      });

      it('should remove a UL node around multiple blocks at current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>one</li><li>two</li><li>three</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.lastChild.firstChild, 1);
        assert(!range.collapsed);
        assert.equal('netwot', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<p>one</p><p>two</p><p>three</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert.equal('netwot', sel.getRangeAt(0).toString());
      });

      it('should remove a UL node around middle block at current Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<p>one</p><ul><li>two</li><li>three</li></ul><p>four</p>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.childNodes[1].firstChild.firstChild, 1);
        range.setEnd(div.childNodes[1].lastChild.firstChild, 1);
        assert(!range.collapsed);
        assert.equal('wot', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<p>one</p><p>two</p><p>three</p><p>four</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert.equal('wot', sel.getRangeAt(0).toString());
      });

      it('should remove a UL node around collapsed Selection when within UL', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>hello world</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 8);
        range.setEnd(div.firstChild.firstChild.firstChild, 8);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<p>hello world</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);

        var p = div.firstChild;
        assert(range.collapsed);
        assert(contains(p, range.startContainer));
        assert(contains(p, range.endContainer));
      });

      it('should remove the last two LIs around Selection at end of list', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>one</li><li>two</li><li>three</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.childNodes[1].firstChild, 1);
        range.setEnd(div.firstChild.lastChild.firstChild, 3);
        assert(!range.collapsed);
        assert.equal('wothr', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li></ul><p>two</p><p>three</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        assert(!sel.getRangeAt(0).collapsed);
        assert.equal('wothr', sel.getRangeAt(0).toString());
      });

      it('should remove the middle LI around collapsed Selection in middle of list', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>one</li><li>two</li><li>three</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.childNodes[1].firstChild, 2);
        range.setEnd(div.firstChild.childNodes[1].firstChild, 2);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li></ul><p>two</p><ul><li>three</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);

        var p = div.childNodes[1];
        assert(range.collapsed);
        assert(contains(p, range.startContainer));
        assert(contains(p, range.endContainer));
      });

      it('should remove the last LI around collapsed Selection at end of list', function () {
        div = document.createElement('div');
        div.innerHTML = '<ul><li>one</li><li>two</li><li>three</li></ul>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.lastChild.firstChild, 3);
        range.setEnd(div.firstChild.lastChild.firstChild, 3);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li><li>two</li></ul><p>three</p>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);

        var p = div.lastChild;
        assert(range.collapsed);
        assert(contains(p, range.startContainer));
        assert(contains(p, range.endContainer));
      });

      it('should turn an OL list into a UL list with collapsed Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<ol><li>one</li><li>two</li><li>three</li></ol>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.firstChild.firstChild, 1);
        assert(range.collapsed);

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li><li>two</li><li>three</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);

        var li = div.firstChild.firstChild;
        assert(range.collapsed);
        assert(contains(li, range.startContainer));
        assert(contains(li, range.endContainer));
      });

      it('should turn an OL list into a UL list with multiple LIs in Selection', function () {
        div = document.createElement('div');
        div.innerHTML = '<ol><li>one</li><li>two</li><li>three</li></ol>';
        div.setAttribute('contenteditable', 'true');
        document.body.appendChild(div);

        // set up current Selection
        var range = document.createRange();
        range.setStart(div.firstChild.firstChild.firstChild, 1);
        range.setEnd(div.firstChild.lastChild.firstChild, 1);
        assert(!range.collapsed);
        assert.equal('netwot', range.toString());

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);

        var list = new ListCommand('ul');
        list.execute();

        // test that we have the expected HTML at this point
        assert.equal('<ul><li>one</li><li>two</li><li>three</li></ul>', div.innerHTML);

        // test that the current Selection is still intact
        sel = window.getSelection();
        range = sel.getRangeAt(0);

        assert(!range.collapsed);
        assert.equal('netwot', range.toString());
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
