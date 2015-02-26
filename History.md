
1.1.3 / 2015-02-26
==================

  * update all outdated deps

1.1.2 / 2015-02-26
==================

  * package: allow any "debug" v2

1.1.1 / 2014-12-09
==================

  * index: use `isList()` for the queryState() function

1.1.0 / 2014-12-09
==================

  * index: add `createList()` and `isList()` functions

1.0.1 / 2014-12-09
==================

  * initial take at converting UL <-> OL
  * test: attempt to make tests pass on Firefox

1.0.0 / 2014-12-08
==================

  * add README.md
  * enable Travis-CI + SauceLabs cloud testing
  * index: handle the case where the UL node is not the immediate parent of the LI
  * index: hoist the `lastBlock` variable out
  * index: handle the "middle" unwrapping case
  * index: handle the "insert after" case
  * index: handle the scenario where the final LI is selected
  * index: throw a TypeError if no node name is provided
  * index: re-use the `block` variable
  * test: add multi-P add/remove tests
  * test: add startContainer and endContainer assertion
  * test: initial test cases
  * package: update "zuul" to v1.15.2
  * initial commit
