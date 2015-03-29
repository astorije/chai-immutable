'use strict';

var Immutable = require('immutable');
var Collection = Immutable.Collection;
var KeyedCollection = Immutable.Collection.Keyed;

module.exports = function (chai, utils) {
  var Assertion = chai.Assertion;

  /**
   * ## BDD API Reference
   */

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
   * ### .keys(key1[, key2, ...[, keyN]])
   *
   * Asserts that the keyed collection contains all of the passed-in keys.
   *
   * `key` is an alias to `keys`.
   *
   * ```js
   * expect(new Map({ foo: 1, bar: 2 })).to.have.key('foo');
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys('foo', 'bar');
   * ```
   *
   * @name keys
   * @param {String...} keyN
   * @alias key
   * @api public
   */

  function assertKeys(_super) {
    return function () {
      var obj = this._obj;

      if (obj && obj instanceof KeyedCollection) {
        var keys = Array.prototype.slice.call(arguments);

        if (!keys.length) throw new Error('keys required');

        var ok = keys.every(function (key) { return obj.has(key); });
        var str;

        if (keys.length > 1) {
          keys = keys.map(utils.inspect);
          var last = keys.pop();
          str = 'keys ' + keys.join(', ') + ', and ' + last;
        }
        else str = 'key ' + utils.inspect(keys[0]);

        this.assert(
          ok,
          'expected #{this} to have ' + str,
          'expected #{this} to not have ' + str
        );
      }
      else _super.apply(this, arguments);
    };
  }

  Assertion.overwriteMethod('keys', assertKeys);
  Assertion.overwriteMethod('key', assertKeys);

  /**
   * ### .size(value)
   *
   * Asserts that the immutable collection has the expected size.
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
   * Similarly to `length`/`lengthOf`, `sizeOf` is an alias of `size`:
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

  function chainCollectionSize() {
    utils.flag(this, 'immutable.collection.size', true);
  }

  Assertion.addChainableMethod('size', assertCollectionSize, chainCollectionSize);
  Assertion.addMethod('sizeOf', assertCollectionSize);

  // Numerical comparator overwrites

  function assertCollectionSizeLeast(_super) {
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

  function assertCollectionSizeMost(_super) {
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

  function assertCollectionSizeAbove(_super) {
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

  function assertCollectionSizeBelow(_super) {
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

  Assertion.overwriteMethod('least', assertCollectionSizeLeast);
  Assertion.overwriteMethod('gte', assertCollectionSizeLeast);

  Assertion.overwriteMethod('most', assertCollectionSizeMost);
  Assertion.overwriteMethod('lte', assertCollectionSizeMost);

  Assertion.overwriteMethod('above', assertCollectionSizeAbove);
  Assertion.overwriteMethod('gt', assertCollectionSizeAbove);
  Assertion.overwriteMethod('greaterThan', assertCollectionSizeAbove);

  Assertion.overwriteMethod('below', assertCollectionSizeBelow);
  Assertion.overwriteMethod('lt', assertCollectionSizeBelow);
  Assertion.overwriteMethod('lessThan', assertCollectionSizeBelow);

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
          min + '..' + max,
          size
        );
      }
      else _super.apply(this, arguments);
    };
  });

  /**
   * ## TDD API Reference
   */

  var assert = chai.assert;

  /**
   * ### .equal(actual, expected)
   *
   * Asserts that the values of the target are equvalent to the values of
   * `collection`. Note that `.strictEqual` and `.deepEqual` assert exactly like
   * `.equal` in the context of Immutable data structures.
   *
   * ```js
   * var a = List.of(1, 2, 3);
   * var b = List.of(1, 2, 3);
   * assert.equal(a, b);
   * ```
   *
   * @name equal
   * @param {Collection} actual
   * @param {Collection} expected
   * @api public
   */

  assert.equal = function (actual, expected) {
    if (actual instanceof Collection) {
      return new Assertion(actual).equal(expected);
    }
    else return assert.equal;
  };

  /**
   * ### .sizeOf(collection, length)
   *
   * Asserts that the immutable collection has the expected size.
   *
   * ```js
   * assert.sizeOf(List.of(1, 2, 3), 3);
   * assert.sizeOf(new List(), 0);
   * ```
   *
   * @name sizeOf
   * @param {Collection} collection
   * @param {Number} size
   * @api public
   */

  assert.sizeOf = function (collection, expected) {
    new Assertion(collection).size(expected);
  };
};
