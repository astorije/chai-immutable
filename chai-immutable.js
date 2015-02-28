'use strict';

var Collection = require('immutable').Collection;

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  /**
   * ### .size(value)
   *
   * Asserts that the immutable collection's `size` property has the expected
   * value.
   *
   * ```js
   * expect(List.of(1, 2, 3)).to.have.size(3);
   * ```
   *
   * It can also be used as a chain precursor to a value comparison for the
   * `size` property.
   *
   * ```js
   * expect(List.of(1, 2, 3)).to.have.size.least(3);
   * expect(List.of(1, 2, 3)).to.have.size.most(3);
   * expect(List.of(1, 2, 3)).to.have.size.above(2);
   * expect(List.of(1, 2, 3)).to.have.size.below(4);
   * expect(List.of(1, 2, 3)).to.have.size.within(2,4);
   * ```
   *
   * Similarly to `length`/`lengthOf`, `sizeOf` can be used as an alias of
   * `size`:
   *
   * ```js
   * expect(List.of(1, 2, 3)).to.have.sizeOf(3);
   * ```
   *
   * @name size
   * @alias sizeOf
   * @param {Number} size
   * @api public
   */

  function assertCollectionSize(n) {
    new Assertion(this._obj).instanceof(Collection);

    var size = this._obj.size;
    new Assertion(size).a('number');

    this.assert(
      size === n,
      'expected #{this} to have size #{exp} but got #{act}',
      'expected #{this} to not have size #{act}',
      n,
      size
    );
  }

  function chainCollectionSize () {
    utils.flag(this, 'immutable.collection.size', true);
  }

  Assertion.addChainableMethod('size', assertCollectionSize, chainCollectionSize);
  Assertion.addMethod('sizeOf', assertCollectionSize);

  // Numerical comparator overwrites

  function assertCollectionSize_least(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
          size >= n,
          'expected #{this} to have a size of at least #{exp} but got #{act}',
          'expected #{this} to not have a size of at least #{exp} but got #{act}',
          n,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  }

  function assertCollectionSize_most(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
          size <= n,
          'expected #{this} to have a size of at most #{exp} but got #{act}',
          'expected #{this} to not have a size of at most #{exp} but got #{act}',
          n,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  }

  function assertCollectionSize_above(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
          size > n,
          'expected #{this} to have a size above #{exp} but got #{act}',
          'expected #{this} to not have a size above #{exp} but got #{act}',
          n,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  }

  function assertCollectionSize_below(_super) {
    return function (n) {
      if (utils.flag(this, 'immutable.collection.size')) {
        new Assertion(this._obj).instanceof(Collection);

        var size = this._obj.size;
        new Assertion(size).a('number');

        this.assert(
          size < n,
          'expected #{this} to have a size below #{exp} but got #{act}',
          'expected #{this} to not have a size below #{exp} but got #{act}',
          n,
          size
        );
      }
      else _super.apply(this, arguments);
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
          min <= size && size <= max,
          'expected #{this} to have a size within #{exp} but got #{act}',
          'expected #{this} to not have a size within #{exp} but got #{act}',
          min + ".." + max,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  });
};
