[![Build Status](https://travis-ci.org/astorije/chai-immutable.svg?branch=master)](https://travis-ci.org/astorije/chai-immutable)
[![devDependency Status](https://david-dm.org/astorije/chai-immutable/dev-status.svg)](https://david-dm.org/astorije/chai-immutable#info=devDependencies)

## Installation

Install via [npm](http://npmjs.org):

```bash
npm install astorije/chai-immutable
```

*Until this plugin is published on <https://www.npmjs.com/>, the command above will retrieve the package from GitHub.*

You can then use this plugin as any other Chai plugins:

```js
var chai = require('chai');
var chaiImmutable = require('chai-immutable');

chai.use(chaiImmutable);
```

## API Reference

### .size(value)

- **@param** *{ Number }* size

Asserts that the immutable collection's `size` property has the expected
value.

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

Similarly to `length`/`lengthOf`, `sizeOf` can be used as an alias of
`size`:

```js
expect(List.of(1, 2, 3)).to.have.sizeOf(3);
```
