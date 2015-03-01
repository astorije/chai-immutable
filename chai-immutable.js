'use strict';

var Immutable = require('immutable')
var Collection = Immutable.Collection;

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  /**
   * ### .empty
   *
   * Asserts that the immutable collection is empty.
   *
   * ```js
   * expect(List()).to.be.empty;
   * expect(List.of(1, 2, 3)).to.not.be.empty;
   * ```
   *
   * @name empty
   * @api public
   */

  Assertion.overwriteProperty('empty', function (_super) {
    return function () {
      var obj = this._obj;

      if (obj && obj instanceof Collection) {
        var size = obj.size;
        new Assertion(size).a('number');

        this.assert(
          size === 0,
          'expected #{this} to be empty but got size #{act}',
          'expected #{this} to not be empty',
          0,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  });

  /**
   * ### .equal(collection)
   *
   * Asserts that the values of the target are equvalent to the values of
   * `collection`. Aliases of Chai's original `equal` method are also supported.
   *
   * ```js
   * var a = List.of(1, 2, 3);
   * var b = List.of(1, 2, 3);
   * expect(a).to.equal(b);
   * ```
   *
   * @name equal
   * @alias equals
   * @alias eq
   * @alias deep.equal
   * @param {Collection} value
   * @api public
   */

   function assertCollectionEqual(_super) {
    return function (collection) {
      var obj = this._obj;

      if (obj && obj instanceof Collection) {
        this.assert(
          Immutable.is(obj, collection),
          'expected #{this} to equal #{exp}',
          'expected #{this} to not equal #{exp}',
          collection
        );
      }
      else _super.apply(this, arguments);
    };
  }

  Assertion.overwriteMethod('equal', assertCollectionEqual);
  Assertion.overwriteMethod('equals', assertCollectionEqual);
  Assertion.overwriteMethod('eq', assertCollectionEqual);

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
