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

### .keys(key1[, key2, ...[, keyN]])

- **@param** *{ String... | Array | Object }* key*N*

Asserts that the keyed collection contains any or all of the passed-in
keys. Use in combination with `any` or `all` will affect what will pass.

When used in conjunction with `any`, at least one key that is passed in
must exist in the target object. Note, either `any` or `all` should be used
in the assertion. If neither are used, the assertion is defaulted to `all`.

`key` is an alias to `keys`.

```js
expect(new Map({ foo: 1, bar: 2 })).to.have.key('foo');
expect(new Map({ foo: 1, bar: 2 })).to.have.keys('foo', 'bar');
expect(new Map({ foo: 1, bar: 2 })).to.have.keys(['bar', 'foo']);
expect(new Map({ foo: 1, bar: 2 })).to.have.keys({ 'bar': 6, 'foo': 7 });
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

- **@param** *{Collection}* actual
- **@param** *{Collection}* expected

Asserts that the values of the target are equvalent to the values of
`collection`. Note that `.strictEqual` and `.deepEqual` assert exactly like
`.equal` in the context of Immutable data structures.

```js
var a = List.of(1, 2, 3);
var b = List.of(1, 2, 3);
assert.equal(a, b);
```

### .sizeOf(collection, length)

- **@param** *{Collection}* collection
- **@param** *{Number}* size

Asserts that the immutable collection has the expected size.

```js
assert.sizeOf(List.of(1, 2, 3), 3);
assert.sizeOf(new List(), 0);
```
