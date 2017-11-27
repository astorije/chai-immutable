[![npm Version](https://img.shields.io/npm/v/chai-immutable.svg)](https://npmjs.org/package/chai-immutable)
[![License](https://img.shields.io/npm/l/chai-immutable.svg)](LICENSE)
[![Build Status](https://travis-ci.org/astorije/chai-immutable.svg?branch=master)](https://travis-ci.org/astorije/chai-immutable)
[![Build Status](https://ci.appveyor.com/api/projects/status/407ts84pq7wd4kt9/branch/master?svg=true)](https://ci.appveyor.com/project/astorije/chai-immutable/branch/master)
[![Coverage Status](https://coveralls.io/repos/astorije/chai-immutable/badge.svg)](https://coveralls.io/r/astorije/chai-immutable)
[![devDependencies Status](https://david-dm.org/astorije/chai-immutable/dev-status.svg)](https://david-dm.org/astorije/chai-immutable?type=dev)
[![peerDependencies Status](https://david-dm.org/astorije/chai-immutable/peer-status.svg)](https://david-dm.org/astorije/chai-immutable?type=peer)

# Chai Immutable

This plugin provides a set of [Chai](http://chaijs.com/) assertions for [Facebook's Immutable library for JavaScript collections](http://facebook.github.io/immutable-js/).

<!-- fulky:globals
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;

var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;
var Set = Immutable.Set;
var Stack = Immutable.Stack;

chai.use(require('./chai-immutable'));
-->

## Installation

### Node.js

Install via [npm](http://npmjs.org):

```bash
npm install chai-immutable
```

⚠️ To use `chai-immutable` with Chai v4, you need to use `npm install chai-immutable@next` instead, until I am done with the v2 release of this plugin. I apologize for the inconvenience in the meantime.

You can then use this plugin as any other Chai plugins:

<!-- fulky:skip-test -->
```js
var chai = require('chai');
var chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);
```

### In the browser

Include this plugin after including Chai and Immutable. It will automatically
plug in to Chai and be ready for use:

```html
<script src="chai-immutable.js"></script>
```

### Using `chai-immutable` with other plugins

If you are using this plugin with
[`chai-as-promised`](https://github.com/domenic/chai-as-promised/) or
[`dirty-chai`](https://github.com/prodatakey/dirty-chai), note that
`chai-immutable` must be loaded **before** any of them. For example:

<!-- fulky:skip-test -->
```js
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var chaiImmutable = require('chai-immutable');
var dirtyChai = require('dirty-chai');
var expect = chai.expect;

chai.use(chaiImmutable);
chai.use(dirtyChai);
chai.use(chaiAsPromised);

var List = require('immutable').List;

/* ... */
return expect(List.of(1, 2, 3)).to.eventually.have.size(3);
expect(true).to.be.true();
```

## BDD API Reference

### .empty

Asserts that the immutable collection is empty.

```js
expect(List()).to.be.empty;
expect(List.of(1, 2, 3)).to.not.be.empty;
```

### .equal(collection)

- **@param** *{ Collection }* collection

Asserts that the values of the target are equivalent to the values of
`collection`. Aliases of Chai's original `equal` method are also supported.

```js
var a = List.of(1, 2, 3);
var b = List.of(1, 2, 3);
expect(a).to.equal(b);
```

Immutable data structures should only contain other immutable data
structures (unlike `Array`s and `Object`s) to be considered immutable and
properly work against `.equal()`. See
[this issue](https://github.com/astorije/chai-immutable/issues/24) for
more information.

Also, note that `deep.equal` and `eql` are synonyms of `equal` when
tested against immutable data structures, therefore they are aliases to
`equal`.

### .include(value)

- **@param** *{ Mixed }* val

The `include` and `contain` assertions can be used as either property
based language chains or as methods to assert the inclusion of a value
in an immutable collection. When used as language chains, they toggle the
`contains` flag for the `keys` assertion.

```js
expect(new List([1, 2, 3])).to.include(2);
expect(new Map({ foo: 'bar', hello: 'world' })).to.include.keys('foo');
```

### .keys(key1[, key2[, ...]])

- **@param** *{ String... | Array | Object | Collection }* key*N*

Asserts that the target collection has the given keys.

When the target is an object or array, keys can be provided as one or more
string arguments, a single array argument, a single object argument, or an
immutable collection. In the last 2 cases, only the keys in the given
object/collection matter; the values are ignored.

```js
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys('foo', 'bar');
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys(new List(['bar', 'foo']));
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys(new Set(['bar', 'foo']));
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys(new Stack(['bar', 'foo']));
expect(new List(['x', 'y'])).to.have.all.keys(0, 1);

expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys(['foo', 'bar']);
expect(new List(['x', 'y'])).to.have.all.keys([0, 1]);

// Values in the passed object are ignored:
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys({ bar: 6, foo: 7 });
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys(new Map({ bar: 6, foo: 7 }));
expect(new List(['x', 'y'])).to.have.all.keys({ 0: 4, 1: 5 });
```

Note that `deep.property` behaves exactly like `property` in the context of
immutable data structures.

By default, the target must have all of the given keys and no more. Add
`.any` earlier in the chain to only require that the target have at least
one of the given keys. Also, add `.not` earlier in the chain to negate
`.keys`. It's often best to add `.any` when negating `.keys`, and to use
`.all` when asserting `.keys` without negation.

When negating `.keys`, `.any` is preferred because `.not.any.keys` asserts
exactly what's expected of the output, whereas `.not.all.keys` creates
uncertain expectations.

```js
// Recommended; asserts that target doesn't have any of the given keys
expect(new Map({a: 1, b: 2})).to.not.have.any.keys('c', 'd');

// Not recommended; asserts that target doesn't have all of the given
// keys but may or may not have some of them
expect(new Map({a: 1, b: 2})).to.not.have.all.keys('c', 'd');
```

When asserting `.keys` without negation, `.all` is preferred because
`.all.keys` asserts exactly what's expected of the output, whereas
`.any.keys` creates uncertain expectations.

```js
// Recommended; asserts that target has all the given keys
expect(new Map({a: 1, b: 2})).to.have.all.keys('a', 'b');

// Not recommended; asserts that target has at least one of the given
// keys but may or may not have more of them
expect(new Map({a: 1, b: 2})).to.have.any.keys('a', 'b');
```

Note that `.all` is used by default when neither `.all` nor `.any` appear
earlier in the chain. However, it's often best to add `.all` anyway because
it improves readability.

```js
// Both assertions are identical
expect(new Map({a: 1, b: 2})).to.have.all.keys('a', 'b'); // Recommended
expect(new Map({a: 1, b: 2})).to.have.keys('a', 'b'); // Not recommended
```

Add `.include` earlier in the chain to require that the target's keys be a
superset of the expected keys, rather than identical sets.

```js
// Target object's keys are a superset of ['a', 'b'] but not identical
expect(new Map({a: 1, b: 2, c: 3})).to.include.all.keys('a', 'b');
expect(new Map({a: 1, b: 2, c: 3})).to.not.have.all.keys('a', 'b');
```

However, if `.any` and `.include` are combined, only the `.any` takes
effect. The `.include` is ignored in this case.

```js
// Both assertions are identical
expect(new Map({a: 1})).to.have.any.keys('a', 'b');
expect(new Map({a: 1})).to.include.any.keys('a', 'b');
```

The alias `.key` can be used interchangeably with `.keys`.

```js
expect(new Map({ foo: 1 })).to.have.key('foo');
```

### .property(path[, val])

- **@param** *{ String | Array | Iterable }* path
- **@param** *{ Mixed }* val (optional)

Asserts that the target has a property with the given `path`.

```js
expect(new Map({a: 1})).to.have.property('a');
```

When `val` is provided, `.property` also asserts that the property's value
is equal to the given `val`. `val` can be an immutable collection.

```js
expect(new Map({a: 1})).to.have.property('a', 1);
```

Note that `deep.property` behaves exactly like `property` in the context of
immutable data structures.

Add `.nested` earlier in the chain to enable dot- and bracket-notation when
referencing nested properties. An immutable `List` can also be used as the
starting point of a `nested.property`.

```js
expect(Immutable.fromJS({a: {b: ['x', 'y']}})).to.have.nested.property('a.b[1]');
expect(Immutable.fromJS({a: {b: ['x', 'y']}})).to.have.nested.property('a.b[1]', 'y');
expect(Immutable.fromJS({a: {b: ['x', 'y']}})).to.have.nested.property(['a', 'b', 1], 'y');
expect(Immutable.fromJS({a: {b: ['x', 'y']}})).to.have.nested.property(new List(['a', 'b', 1]), 'y');
```

If `.` or `[]` are part of an actual property name, they can be escaped by
adding two backslashes before them.

```js
expect(Immutable.fromJS({'.a': {'[b]': 'x'}})).to.have.nested.property('\\.a.\\[b\\]');
```

Add `.not` earlier in the chain to negate `.property`.

```js
expect(new Map({a: 1})).to.not.have.property('b');
```

However, it's dangerous to negate `.property` when providing `val`. The
problem is that it creates uncertain expectations by asserting that the
target either doesn't have a property at the given `path`, or that it
does have a property at the given key `path` but its value isn't equal to
the given `val`. It's often best to identify the exact output that's
expected, and then write an assertion that only accepts that exact output.

When the target isn't expected to have a property at the given
`path`, it's often best to assert exactly that.

```js
expect(new Map({b: 2})).to.not.have.property('a'); // Recommended
expect(new Map({b: 2})).to.not.have.property('a', 1); // Not recommended
```

When the target is expected to have a property at the given key `path`,
it's often best to assert that the property has its expected value, rather
than asserting that it doesn't have one of many unexpected values.

```js
expect(new Map({a: 3})).to.have.property('a', 3); // Recommended
expect(new Map({a: 3})).to.not.have.property('a', 1); // Not recommended
```

`.property` changes the target of any assertions that follow in the chain
to be the value of the property from the original target object.

```js
expect(new Map({a: 1})).to.have.property('a').that.is.a('number');
```

### .size(value)

- **@param** *{ Number }* size

Asserts that the immutable collection has the expected size.

```js
expect(List.of(1, 2, 3)).to.have.size(3);
```

It can also be used as a chain precursor to a value comparison for the
`size` property.

```js
expect(List.of(1, 2, 3)).to.have.size.least(3);
expect(List.of(1, 2, 3)).to.have.size.most(3);
expect(List.of(1, 2, 3)).to.have.size.above(2);
expect(List.of(1, 2, 3)).to.have.size.below(4);
expect(List.of(1, 2, 3)).to.have.size.within(2,4);
```

Similarly to `length`/`lengthOf`, `sizeOf` is an alias of `size`:

```js
expect(List.of(1, 2, 3)).to.have.sizeOf(3);
```

## TDD API Reference

### .equal(actual, expected)

- **@param** *{ Collection }* actual
- **@param** *{ Collection }* expected

Asserts that the values of `actual` are equivalent to the values of
`expected`. Note that `.strictEqual()` and `.deepEqual()` assert
exactly like `.equal()` in the context of Immutable data structures.

```js
var a = List.of(1, 2, 3);
var b = List.of(1, 2, 3);
assert.equal(a, b);
```

Immutable data structures should only contain other immutable data
structures (unlike `Array`s and `Object`s) to be considered immutable and
properly work against `.equal()`, `.strictEqual()` or `.deepEqual()`. See
[this issue](https://github.com/astorije/chai-immutable/issues/24) for
more information.

### .notEqual(actual, expected)

- **@param** *{ Collection }* actual
- **@param** *{ Collection }* expected

Asserts that the values of `actual` are not equivalent to the values of
`expected`. Note that `.notStrictEqual()` and `.notDeepEqual()` assert
exactly like `.notEqual()` in the context of Immutable data structures.

```js
var a = List.of(1, 2, 3);
var b = List.of(4, 5, 6);
assert.notEqual(a, b);
```

### .sizeOf(collection, length)

- **@param** *{ Collection }* collection
- **@param** *{ Number }* size

Asserts that the immutable collection has the expected size.

```js
assert.sizeOf(List.of(1, 2, 3), 3);
assert.sizeOf(new List(), 0);
```
