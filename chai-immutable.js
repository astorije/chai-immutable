'use strict';

var Immutable = require('immutable');
var Collection = Immutable.Collection;
var IndexedCollection = Immutable.Collection.Indexed;
var KeyedCollection = Immutable.Collection.Keyed;
var SetCollection = Immutable.Collection.Set;

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

      if (obj && obj instanceof Collection || collection instanceof Collection) {
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
   * ### .include(value)
   *
   * The `include` and `contain` assertions can be used as either property
   * based language chains or as methods to assert the inclusion of a value
   * in an immutable collection. When used as language chains, they toggle the
   * `contains` flag for the `keys` assertion.
   *
   * ```js
   * expect(new List([1, 2, 3])).to.include(2);
   * expect(new Map({ foo: 'bar', hello: 'universe' })).to.include.keys('foo');
   * ```
   *
   * @name include
   * @alias contain
   * @alias includes
   * @alias contains
   * @param {Mixed} val
   * @api public
   */

  function assertCollectionInclude(_super) {
    return function (val) {
      var obj = this._obj;

      if (obj && obj instanceof Collection) {
        this.assert(
          obj.includes(val),
          'expected #{this} to include #{exp}',
          'expected #{this} to not include #{exp}',
          val
        );
      }
      else _super.apply(this, arguments);
    };
  }

  function chainCollectionInclude(_super) {
    return function (val) {
      _super.apply(this, arguments);
    };
  };

  ['include', 'contain', 'contains', 'includes'].forEach(function (keyword) {
    Assertion.overwriteChainableMethod(
      keyword,
      assertCollectionInclude,
      chainCollectionInclude
    );
  });

  /**
   * ### .keys(key1[, key2, ...[, keyN]])
   *
   * Asserts that the keyed collection contains any or all of the passed-in
   * keys. Use in combination with `any`, `all`, `contains`, or `have` will
   * affect what will pass.
   *
   * When used in conjunction with `any`, at least one key that is passed in
   * must exist in the target object. This is regardless whether or not
   * the `have` or `contain` qualifiers are used. Note, either `any` or `all`
   * should be used in the assertion. If neither are used, the assertion is
   * defaulted to `all`.
   *
   * When both `all` and `contain` are used, the target object must have at
   * least all of the passed-in keys but may have more keys not listed.
   *
   * When both `all` and `have` are used, the target object must both contain
   * all of the passed-in keys AND the number of keys in the target object must
   * match the number of keys passed in (in other words, a target object must
   * have all and only all of the passed-in keys).
   *
   * `key` is an alias to `keys`.
   *
   * ```js
   * expect(new Map({ foo: 1 })).to.have.key('foo');
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys('foo', 'bar');
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new List(['bar', 'foo']));
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Set(['bar', 'foo']));
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Stack(['bar', 'foo']));
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(['bar', 'foo']);
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys({ 'bar': 6, 'foo': 7 });
   * expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Map({ 'bar': 6, 'foo': 7 }));
   * expect(new Map({ foo: 1, bar: 2 })).to.have.any.keys('foo', 'not-foo');
   * expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys('foo', 'bar');
   * expect(new Map({ foo: 1, bar: 2 })).to.contain.key('foo');
   * ```
   *
   * @name keys
   * @param {String...|Array|Object|Collection} keyN
   * @alias key
   * @api public
   */

  function assertKeyedCollectionKeys(_super) {
    return function (keys) {
      function has(key) { return obj.has(key); }

      var obj = this._obj;

      if (obj && obj instanceof KeyedCollection) {
        switch (utils.type(keys)) {
          case 'object':
            if (keys instanceof IndexedCollection || keys instanceof SetCollection) {
              keys = keys.toJS();
            }
            else if (keys instanceof KeyedCollection) keys = keys.keySeq().toJS();
            else keys = Object.keys(keys);
          case 'array':
            if (arguments.length > 1) throw new Error(
              'keys must be given single argument of ' +
              'Array|Object|String|Collection, ' +
              'or multiple String arguments'
            );
            break;
          default:
            keys = Array.prototype.slice.call(arguments);
            break;
        }

        if (!keys.length) throw new Error('keys required');

        var any = utils.flag(this, 'any');
        var contains = utils.flag(this, 'contains');
        var ok;
        var str = (contains ? 'contain' : 'have') + ' ';

        if (any) ok = keys.some(has);
        else {
          ok = keys.every(has);
          if (!contains) ok = ok && keys.length === obj.count();
        }

        if (keys.length > 1) {
          keys = keys.map(utils.inspect);
          var last = keys.pop();
          var conjunction = any ? 'or' : 'and';
          str += 'keys ' + keys.join(', ') + ', ' + conjunction + ' ' + last;
        }
        else str += 'key ' + utils.inspect(keys[0]);

        this.assert(
          ok,
          'expected #{this} to ' + str,
          'expected #{this} to not ' + str
        );
      }
      else _super.apply(this, arguments);
    };
  }

  Assertion.overwriteMethod('keys', assertKeyedCollectionKeys);
  Assertion.overwriteMethod('key', assertKeyedCollectionKeys);

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
    if (actual instanceof Collection || expected instanceof Collection) {
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
