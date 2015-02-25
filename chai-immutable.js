'use strict';

var Collection = require('immutable').Collection;

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  // size method

  function assertCollectionSize(n) {
    new Assertion(this._obj).instanceof(Collection);

    var size = this._obj.size;
    new Assertion(size).a('number');

    this.assert(
        size === n
      , "expected #{this} to have have size #{exp} but got #{act}"
      , "expected #{this} to not have size #{act}"
      , n
      , size
    );
  }

  function chainCollectionSize () {
    utils.flag(this, 'immutable.collection.size', true);
  }

  Assertion.addChainableMethod('size', assertCollectionSize, chainCollectionSize);
  Assertion.addMethod('sizeOf', assertCollectionSize);
};
