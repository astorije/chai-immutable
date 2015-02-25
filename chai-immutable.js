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

  // size property

  function assertCollectionSize_least(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
            size >= n
          , "expected #{this} to have a size of at least #{exp} but got #{act}"
          , "expected #{this} to not have a size of at least #{exp} but got #{act}"
          , n
          , size
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  }

  function assertCollectionSize_most(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
            size <= n
          , "expected #{this} to have a size of at most #{exp} but got #{act}"
          , "expected #{this} to not have a size of at most #{exp} but got #{act}"
          , n
          , size
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  }

  function assertCollectionSize_above(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
            size > n
          , "expected #{this} to have a size above #{exp} but got #{act}"
          , "expected #{this} to not have a size above #{exp} but got #{act}"
          , n
          , size
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  }

  function assertCollectionSize_below(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
            size < n
          , "expected #{this} to have a size below #{exp} but got #{act}"
          , "expected #{this} to not have a size below #{exp} but got #{act}"
          , n
          , size
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  }

  Assertion.overwriteMethod('least', assertCollectionSize_least);
  Assertion.overwriteMethod('gte', assertCollectionSize_least);

  Assertion.overwriteMethod('most', assertCollectionSize_most);
  Assertion.overwriteMethod('lte', assertCollectionSize_most);

  Assertion.overwriteMethod('above', assertCollectionSize_above);
  Assertion.overwriteMethod('gt', assertCollectionSize_above);
  Assertion.overwriteMethod('greaterThan', assertCollectionSize_above);

  Assertion.overwriteMethod('below', assertCollectionSize_below);
  Assertion.overwriteMethod('lt', assertCollectionSize_below);
  Assertion.overwriteMethod('lessThan', assertCollectionSize_below);

  Assertion.overwriteMethod('within', function (_super) {
    return function (min, max) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
            min <= size && size <= max
          , "expected #{this} to have a size within #{exp} but got #{act}"
          , "expected #{this} to not have a size within #{exp} but got #{act}",
          min + ".." + max,
          size
        );
      } else {
        _super.apply(this, arguments);
      }
    };
  });
};
