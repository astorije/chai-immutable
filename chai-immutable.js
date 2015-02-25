'use strict';

var Collection = require('immutable').Collection;

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('size', function (n) {
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
  });
};
