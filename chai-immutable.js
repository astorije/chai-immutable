'use strict';

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  Assertion.addMethod('size', function (size) {
    var obj = this._obj;

    this.assert(
        obj.size === size
      , "expected #{this} to have size #{exp} but got #{act}"
      , "expected #{this} to not have size #{act}"
      , size // expected
      , obj.size // actual
    );
  });
};
