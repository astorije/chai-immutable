'use strict';

(function (context, factory) {
  if (typeof require === 'function' &&
      typeof exports === 'object' &&
      typeof module === 'object') {
    // Node.js
    module.exports = factory(require('immutable'));
  }
  else if (typeof define === 'function' && define.amd) {
    // AMD
    throw new Error('chai-immutable is not compatible with an AMD loader yet.');
  }
  else {
    // Other environments (usually <script> tag)
    context.chai.use(factory(context.Immutable));
  }
}(this, function (Immutable) {
  return function (chai, utils) {
    var Assertion = chai.Assertion;

    function assertIsIterable(obj) {
      new Assertion(obj).assert(
        Immutable.Iterable.isIterable(obj),
        'expected #{this} to be an Iterable'
      );
    }

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
     * @namespace BDD
     * @api public
     */

    Assertion.overwriteProperty('empty', function (_super) {
      return function () {
        var obj = this._obj;

        if (Immutable.Iterable.isIterable(obj)) {
          var size = obj.size;
          new Assertion(size).a('number');

          this.assert(
            size === 0,
            'expected #{this} to be empty but got size #{act}',
            'expected #{this} to not be empty'
          );
        }
        else _super.apply(this, arguments);
      };
    });

    /**
     * ### .equal(collection)
     *
     * Asserts that the values of the target are equivalent to the values of
     * `collection`. Aliases of Chai's original `equal` method are also supported.
     *
     * ```js
     * var a = List.of(1, 2, 3);
     * var b = List.of(1, 2, 3);
     * expect(a).to.equal(b);
     * ```
     *
     * Immutable data structures should only contain other immutable data
     * structures (unlike `Array`s and `Object`s) to be considered immutable and
     * properly work against `.equal()`. See
     * [this issue](https://github.com/astorije/chai-immutable/issues/24) for
     * more information.
     *
     * Also, note that `deep.equal` and `eql` are synonyms of `equal` when
     * tested against immutable data structures, therefore they are aliases to
     * `equal`.
     *
     * @name equal
     * @alias equals
     * @alias eq
     * @alias eql
     * @alias eqls
     * @alias deep.equal
     * @param {Collection} value
     * @namespace BDD
     * @api public
     */

    function assertCollectionEqual(_super) {
      return function (collection) {
        var obj = this._obj;

        if (Immutable.Iterable.isIterable(obj)) {
          this.assert(
            Immutable.is(obj, collection),
            'expected #{act} to equal #{exp}',
            'expected #{act} to not equal #{exp}',
            collection.toString(),
            obj.toString(),
            true
          );
        }
        else _super.apply(this, arguments);
      };
    }

    Assertion.overwriteMethod('equal', assertCollectionEqual);
    Assertion.overwriteMethod('equals', assertCollectionEqual);
    Assertion.overwriteMethod('eq', assertCollectionEqual);
    Assertion.overwriteMethod('eql', assertCollectionEqual);
    Assertion.overwriteMethod('eqls', assertCollectionEqual);

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
     * @namespace BDD
     * @api public
     */

    function assertCollectionInclude(_super) {
      return function (val) {
        var obj = this._obj;

        if (Immutable.Iterable.isIterable(obj)) {
          this.assert(
            obj.includes(val),
            'expected #{act} to include #{exp}',
            'expected #{act} to not include #{exp}',
            val,
            obj.toString()
          );
        }
        else _super.apply(this, arguments);
      };
    }

    function chainCollectionInclude(_super) {
      return function () {
        _super.apply(this, arguments);
      };
    }

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
     * @namespace BDD
     * @api public
     */

    function assertKeyedCollectionKeys(_super) {
      return function (keys) {
        function has(key) { return obj.has(key); }

        var obj = this._obj;

        if (Immutable.Iterable.isKeyed(obj)) {
          switch (utils.type(keys)) {
            case 'object':
              if (Immutable.Iterable.isIndexed(keys))
                keys = keys.toJS();
              else if (Immutable.Iterable.isIterable(keys))
                keys = keys.keySeq().toJS();
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
            if (!contains && !utils.flag(this, 'negate')) {
              ok = ok && keys.length === obj.count();
            }
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
            'expected #{act} to ' + str,
            'expected #{act} to not ' + str,
            keys,
            obj.toString()
          );
        }
        else _super.apply(this, arguments);
      };
    }

    Assertion.overwriteMethod('keys', assertKeyedCollectionKeys);
    Assertion.overwriteMethod('key', assertKeyedCollectionKeys);

    /*!
     * ## parsePath(path)
     *
     * Helper function used to parse string paths into arrays of keys and
     * indices.
     *
     * ```js
     * var parsed = parsePath('myobject.key.subkey');
     * ```
     *
     * ### Paths:
     *
     * - Can be as near infinitely deep and nested
     * - Arrays are also valid using the formal `myobject.document[3].key`.
     * - Literal dots and brackets (not delimiter) must be backslash-escaped.
     *
     * This function is inspired from Chai's original `parsePath` function:
     * https://github.com/chaijs/chai/blob/d664ef4/lib/chai/utils/getPathInfo.js#L46-L74
     *
     * @param {String} path
     * @returns {Array} parsed
     * @api private
     */
    function parsePath(path) { // Given the following path: 'a.b[1]'
      // Separates keys followed by indices with a dot: 'a.b.[1]'
      var str = path.replace(/([^\\])\[/g, '$1.[');
      // Extracts all indices and keys into an array: ['a', 'b', '[1]']
      var parts = str.match(/(\\\.|[^.]+?)+/g);

      // Removes brackets and escaping backslashes, and extracts digits from
      // each value in the array: ['a', 'b', 1]
      return parts.map(function (value) {
        // Extracts indices wrapped in brackets
        var re = /^\[(\d+)\]$/;
        // Builds ['[<index>]', '<index>'] if value is a digit, null otherwise
        var mArr = re.exec(value);

        // If the value was of form '[<index>]', returns <index>
        // Otherwise, returns the key without the escaping backslashes
        if (mArr) return parseFloat(mArr[1]);
        else return value.replace(/\\([.\[\]])/g, '$1');
      });
    }

    /**
     * ### .property(name, [value])
     *
     * Asserts that the target has a property `name`, optionally asserting that
     * the value of that property is equal to `value`. `value` can be an
     * Immutable object.
     * If the `deep` flag is set, you can use dot- and bracket-notation for deep
     * references into objects and arrays.
     *
     * ```js
     * // Simple referencing
     * var map = new Map({ foo: 'bar' });
     * expect(map).to.have.property('foo');
     * expect(map).to.have.property('foo', 'bar');
     *
     * // Deep referencing
     * var deepMap = new Map({
     *     green: new Map({ tea: 'matcha' }),
     *     teas: new List(['chai', 'matcha', new Map({ tea: 'konacha' })])
     * });
     *
     * expect(deepMap).to.have.deep.property('green.tea', 'matcha');
     * expect(deepMap).to.have.deep.property(['green', 'tea'], 'matcha');
     * expect(deepMap).to.have.deep.property(new List(['green', 'tea']), 'matcha');
     * expect(deepMap).to.have.deep.property('teas[1]', 'matcha');
     * expect(deepMap).to.have.deep.property(['teas', 1], 'matcha');
     * expect(deepMap).to.have.deep.property(new List(['teas', 1]), 'matcha');
     * expect(deepMap).to.have.deep.property('teas[2].tea', 'konacha');
     * expect(deepMap).to.have.deep.property(['teas', 2, 'tea'], 'konacha');
     * expect(deepMap).to.have.deep.property(new List(['teas', 2, 'tea']), 'konacha');
     * ```
     *
     * You can also use a `List` as the starting point of a `deep.property`
     * assertion, or traverse nested `List`s.
     *
     * ```js
     * var list = new List([
     *   new List(['chai', 'matcha', 'konacha']),
     *   new List([
     *     new Map({ tea: 'chai' }),
     *     new Map({ tea: 'matcha' }),
     *     new Map({ tea: 'konacha' })
     *   ])
     * ]);
     *
     * expect(list).to.have.deep.property('[0][1]', 'matcha');
     * expect(list).to.have.deep.property([0, 1], 'matcha');
     * expect(list).to.have.deep.property(new List([0, 1]), 'matcha');
     * expect(list).to.have.deep.property('[1][2].tea', 'konacha');
     * expect(list).to.have.deep.property([1, 2, 'tea'], 'konacha');
     * expect(list).to.have.deep.property(new List([1, 2, 'tea']), 'konacha');
     * ```
     *
     * Furthermore, `property` changes the subject of the assertion
     * to be the value of that property from the original object. This
     * permits for further chainable assertions on that property.
     *
     * ```js
     * expect(map).to.have.property('foo')
     *   .that.is.a('string');
     * expect(deepMap).to.have.property('green')
     *   .that.is.an.instanceof(Map)
     *   .that.equals(new Map({ tea: 'matcha' }));
     * expect(deepMap).to.have.property('teas')
     *   .that.is.an.instanceof(List)
     *   .with.deep.property([2])
     *     .that.equals(new Map({ tea: 'konacha' }));
     * ```
     *
     * Note that dots and brackets in `name` must be backslash-escaped when
     * the `deep` flag is set, while they must NOT be escaped when the `deep`
     * flag is not set.
     *
     * ```js
     * // Simple referencing
     * var css = new Map({ '.link[target]': 42 });
     * expect(css).to.have.property('.link[target]', 42);
     *
     * // Deep referencing
     * var deepCss = new Map({ '.link': new Map({ '[target]': 42 }) });
     * expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
     * ```
     *
     * @name property
     * @param {String|Array|Iterable} name
     * @param {Mixed} value (optional)
     * @namespace BDD
     * @api public
     */
    function assertProperty(_super) {
      return function (path, val) {
        var obj = this._obj;

        if (Immutable.Iterable.isIterable(this._obj)) {
          var isDeep = Boolean(utils.flag(this, 'deep'));
          var negate = Boolean(utils.flag(this, 'negate'));

          var descriptor;
          var hasProperty;
          var value;

          if (isDeep) {
            descriptor = 'deep property ';
            if (typeof path === 'string') {
              path = parsePath(path);
            }
            value = obj.getIn(path);
            hasProperty = obj.hasIn(path);
          }
          else {
            descriptor = 'property ';
            value = obj.get(path);
            hasProperty = obj.has(path);
          }

          // In the negate case, we only throw if property is missing so we can
          // check the value later.
          if (negate && arguments.length > 1) {
            if (!hasProperty) {
              throw new chai.AssertionError('expected ' + utils.inspect(obj) +
                ' to have a ' + descriptor + utils.inspect(path));
            }
          }
          else {
            this.assert(
              hasProperty,
              'expected #{this} to have a ' + descriptor + utils.inspect(path),
              'expected #{this} not to have ' + descriptor + utils.inspect(path)
            );
          }

          if (arguments.length > 1) {
            var isEqual;
            if (Immutable.Iterable.isIterable(val)) {
              isEqual = Immutable.is(val, value);
            }
            else {
              isEqual = val === value;
            }

            this.assert(
              isEqual,
              'expected #{this} to have a ' + descriptor + utils.inspect(path) +
                ' of #{exp}, but got #{act}',
              'expected #{this} not to have a ' + descriptor + utils.inspect(path) +
                ' of #{act}',
              val,
              value
            );
          }

          utils.flag(this, 'object', value);
        }
        else return _super.apply(this, arguments);
      };
    }

    Assertion.overwriteMethod('property', assertProperty);

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
     * @namespace BDD
     * @api public
     */

    function assertCollectionSize(n) {
      assertIsIterable(this._obj);

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
          assertIsIterable(this._obj);

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
          assertIsIterable(this._obj);

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
          assertIsIterable(this._obj);

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
          assertIsIterable(this._obj);

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
          assertIsIterable(this._obj);

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
    var originalEqual = assert.equal;
    var originalNotEqual = assert.notEqual;

    /**
     * ### .equal(actual, expected)
     *
     * Asserts that the values of `actual` are equivalent to the values of
     * `expected`. Note that `.strictEqual()` and `.deepEqual()` assert
     * exactly like `.equal()` in the context of Immutable data structures.
     *
     * ```js
     * var a = List.of(1, 2, 3);
     * var b = List.of(1, 2, 3);
     * assert.equal(a, b);
     * ```
     *
     * Immutable data structures should only contain other immutable data
     * structures (unlike `Array`s and `Object`s) to be considered immutable and
     * properly work against `.equal()`, `.strictEqual()` or `.deepEqual()`. See
     * [this issue](https://github.com/astorije/chai-immutable/issues/24) for
     * more information.
     *
     * @name equal
     * @param {Collection} actual
     * @param {Collection} expected
     * @namespace Assert
     * @api public
     */

    assert.equal = function (actual, expected) {
      // It seems like we shouldn't actually need this check, however,
      // `assert.equal` actually behaves differently than its BDD counterpart!
      // Namely, the BDD version is strict while the "assert" one isn't.
      if (Immutable.Iterable.isIterable(actual)) {
        return new Assertion(actual).equal(expected);
      }
      else return originalEqual(actual, expected);
    };

    /**
     * ### .notEqual(actual, expected)
     *
     * Asserts that the values of `actual` are not equivalent to the values of
     * `expected`. Note that `.notStrictEqual()` and `.notDeepEqual()` assert
     * exactly like `.notEqual()` in the context of Immutable data structures.
     *
     * ```js
     * var a = List.of(1, 2, 3);
     * var b = List.of(4, 5, 6);
     * assert.notEqual(a, b);
     * ```
     *
     * @name notEqual
     * @param {Collection} actual
     * @param {Collection} expected
     * @namespace Assert
     * @api public
     */

    assert.notEqual = function (actual, expected) {
      if (Immutable.Iterable.isIterable(actual)) {
        return new Assertion(actual).not.equal(expected);
      }
      else return originalNotEqual(actual, expected);
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
     * @namespace Assert
     * @api public
     */

    assert.sizeOf = function (collection, expected) {
      new Assertion(collection).size(expected);
    };
  };
}));
