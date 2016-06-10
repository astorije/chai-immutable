[![npm Version](https://img.shields.io/npm/v/chai-immutable.svg)](https://npmjs.org/package/chai-immutable)
[![License](https://img.shields.io/npm/l/chai-immutable.svg)](LICENSE)
[![Build Status](https://travis-ci.org/astorije/chai-immutable.svg?branch=master)](https://travis-ci.org/astorije/chai-immutable)
[![Build Status](https://ci.appveyor.com/api/projects/status/407ts84pq7wd4kt9/branch/master?svg=true)](https://ci.appveyor.com/project/astorije/chai-immutable/branch/master)
[![Coverage Status](https://coveralls.io/repos/astorije/chai-immutable/badge.svg)](https://coveralls.io/r/astorije/chai-immutable)
[![devDependency Status](https://david-dm.org/astorije/chai-immutable/dev-status.svg)](https://david-dm.org/astorije/chai-immutable#info=devDependencies)
[![peerDependency Status](https://david-dm.org/astorije/chai-immutable/peer-status.svg)](https://david-dm.org/astorije/chai-immutable#info=peerDependencies)

# Chai Immutable

This plugin provides a set of [Chai](http://chaijs.com/) assertions for [Facebook's Immutable library for JavaScript collections](http://facebook.github.io/immutable-js/).

## Installation

### Node.js

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

### .property(name, [value])

- **@param** *{ String | Array | Iterable }* name
- **@param** *{ Mixed }* value (optional)

Asserts that the target has a property `name`, optionally asserting that
the value of that property is equal to `value`. `value` can be an
Immutable object.
If the `deep` flag is set, you can use dot- and bracket-notation for deep
references into objects and arrays.

```js
// Simple referencing
var map = new Map({ foo: 'bar' });
expect(map).to.have.property('foo');
expect(map).to.have.property('foo', 'bar');

// Deep referencing
var deepMap = new Map({
    green: new Map({ tea: 'matcha' }),
    teas: new List(['chai', 'matcha', new Map({ tea: 'konacha' })])
});

expect(deepMap).to.have.deep.property('green.tea', 'matcha');
expect(deepMap).to.have.deep.property(['green', 'tea'], 'matcha');
expect(deepMap).to.have.deep.property(new List(['green', 'tea']), 'matcha');
expect(deepMap).to.have.deep.property('teas[1]', 'matcha');
expect(deepMap).to.have.deep.property(['teas', 1], 'matcha');
expect(deepMap).to.have.deep.property(new List(['teas', 1]), 'matcha');
expect(deepMap).to.have.deep.property('teas[2].tea', 'konacha');
expect(deepMap).to.have.deep.property(['teas', 2, 'tea'], 'konacha');
expect(deepMap).to.have.deep.property(new List(['teas', 2, 'tea']), 'konacha');
```

You can also use a `List` as the starting point of a `deep.property`
assertion, or traverse nested `List`s.

```js
var list = new List([
  new List(['chai', 'matcha', 'konacha']),
  new List([
    new Map({ tea: 'chai' }),
    new Map({ tea: 'matcha' }),
    new Map({ tea: 'konacha' })
  ])
]);

expect(list).to.have.deep.property('[0][1]', 'matcha');
expect(list).to.have.deep.property([0, 1], 'matcha');
expect(list).to.have.deep.property(new List([0, 1]), 'matcha');
expect(list).to.have.deep.property('[1][2].tea', 'konacha');
expect(list).to.have.deep.property([1, 2, 'tea'], 'konacha');
expect(list).to.have.deep.property(new List([1, 2, 'tea']), 'konacha');
```

Furthermore, `property` changes the subject of the assertion
to be the value of that property from the original object. This
permits for further chainable assertions on that property.

```js
expect(map).to.have.property('foo')
  .that.is.a('string');
expect(deepMap).to.have.property('green')
  .that.is.an.instanceof(Map)
  .that.equals(new Map({ tea: 'matcha' }));
expect(deepMap).to.have.property('teas')
  .that.is.an.instanceof(List)
  .with.deep.property([2])
    .that.equals(new Map({ tea: 'konacha' }));
```

Note that dots and brackets in `name` must be backslash-escaped when
the `deep` flag is set, while they must NOT be escaped when the `deep`
flag is not set.

```js
// Simple referencing
var css = new Map({ '.link[target]': 42 });
expect(css).to.have.property('.link[target]', 42);

// Deep referencing
var deepCss = new Map({ '.link': new Map({ '[target]': 42 }) });
expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
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
