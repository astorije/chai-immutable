[![npm version](https://img.shields.io/npm/v/chai-immutable.svg)](https://npmjs.org/package/chai-immutable)
[![License](https://img.shields.io/npm/l/chai-immutable.svg)](LICENSE)
[![Build Status](https://travis-ci.org/astorije/chai-immutable.svg?branch=master)](https://travis-ci.org/astorije/chai-immutable)
[![Coverage Status](https://coveralls.io/repos/astorije/chai-immutable/badge.svg)](https://coveralls.io/r/astorije/chai-immutable)
[![devDependency Status](https://david-dm.org/astorije/chai-immutable/dev-status.svg)](https://david-dm.org/astorije/chai-immutable#info=devDependencies)

# Chai Immutable

This provide a set of [Chai](http://chaijs.com/) assertions for [Facebook's Immutable library for JavaScript collections](http://facebook.github.io/immutable-js/).

## Installation

Install via [npm](http://npmjs.org):

```bash
npm install chai-immutable
```

You can then use this plugin as any other Chai plugins:

```js
var chai = require('chai');
var chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);
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

Asserts that the values of the target are equvalent to the values of
`collection`. Aliases of Chai's original `equal` method are also supported.

```js
var a = List.of(1, 2, 3);
var b = List.of(1, 2, 3);
expect(a).to.equal(b);
```

### .frozen

Asserts that any object is frozen.

```js
var obj = { foo: 'bar' };
Object.freeze(obj);
expect(obj).to.be.frozen;
```

### .include(value)

- **@param** *{ Mixed }* val

The `include` and `contain` assertions can be used as either property
based language chains or as methods to assert the inclusion of a value
in an immutable collection. When used as language chains, they toggle the
`contains` flag for the `keys` assertion.

```js
expect(new List([1, 2, 3])).to.include(2);
expect(new Map({ foo: 'bar', hello: 'universe' })).to.include.keys('foo');
```

### .keys(key1[, key2, ...[, keyN]])

- **@param** *{ String... | Array | Object | Collection }* key*N*

Asserts that the keyed collection contains any or all of the passed-in
keys. Use in combination with `any`, `all`, `contains`, or `have` will
affect what will pass.

When used in conjunction with `any`, at least one key that is passed in
must exist in the target object. This is regardless whether or not
the `have` or `contain` qualifiers are used. Note, either `any` or `all`
should be used in the assertion. If neither are used, the assertion is
defaulted to `all`.

When both `all` and `contain` are used, the target object must have at
least all of the passed-in keys but may have more keys not listed.

When both `all` and `have` are used, the target object must both contain
all of the passed-in keys AND the number of keys in the target object must
match the number of keys passed in (in other words, a target object must
have all and only all of the passed-in keys).

`key` is an alias to `keys`.

```js
expect(new Map({ foo: 1 })).to.have.key('foo');
expect(new Map({ foo: 1, bar: 2 })).to.have.keys('foo', 'bar');
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new List(['bar', 'foo']));
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Set(['bar', 'foo']));
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Stack(['bar', 'foo']));
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(['bar', 'foo']);
expect(new Map({ foo: 1, bar: 2 })).to.have.keys({ 'bar': 6, 'foo': 7 });
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(new Map({ 'bar': 6, 'foo': 7 }));
expect(new Map({ foo: 1, bar: 2 })).to.have.any.keys('foo', 'not-foo');
expect(new Map({ foo: 1, bar: 2 })).to.have.all.keys('foo', 'bar');
expect(new Map({ foo: 1, bar: 2 })).to.contain.key('foo');
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

Asserts that the values of the target are equvalent to the values of
`collection`. Note that `.strictEqual` and `.deepEqual` assert exactly like
`.equal` in the context of Immutable data structures.

```js
var a = List.of(1, 2, 3);
var b = List.of(1, 2, 3);
assert.equal(a, b);
```

### .isFrozen(object)

- **@param** *{ Object }* object

Asserts that any object is frozen.

```js
var obj = { foo: 'bar' };
Object.freeze(obj);
assert.isFrozen(obj);
```

### .isNotFrozen(object)

- **@param** *{ Object }* object

Asserts that any object is not frozen.

```js
var obj = { foo: 'bar' };
assert.isNotFrozen(obj);
```

### .sizeOf(collection, length)

- **@param** *{ Collection }* collection
- **@param** *{ Number }* size

Asserts that the immutable collection has the expected size.

```js
assert.sizeOf(List.of(1, 2, 3), 3);
assert.sizeOf(new List(), 0);
```
