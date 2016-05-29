'use strict';

// From http://stackoverflow.com/a/728694
function clone(obj) {
  if (null === obj || 'object' !== typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

var typeEnv;
if (!chai) {
  var chai = require('chai');
  var chaiImmutable = require('../chai-immutable');
  var Immutable = require('immutable');

  chai.use(chaiImmutable);
  typeEnv = 'Node.js';
}
else typeEnv = 'PhantomJS';

var clonedImmutable = clone(Immutable);

var assert = chai.assert;
var expect = chai.expect;
var List = Immutable.List;
var Map = Immutable.Map;
var Set = Immutable.Set;
var Stack = Immutable.Stack;

/*!
 * Test helper to check that a given function (wrapping the assertion) will
 * fail.
 */
function fail(fn, msg) {
  if (msg !== undefined) expect(fn).to.throw(chai.AssertionError, msg);
  else expect(fn).to.throw(chai.AssertionError);
}

describe('chai-immutable (' + typeEnv + ')', function () {
  var list3 = List.of(1, 2, 3);

  var deepMap = new Map({
    foo: 'bar',
    list: List.of(1, 2, 3),
  });

  var sameDeepMap = new Map({
    foo: 'bar',
    list: List.of(1, 2, 3),
  });

  var differentDeepMap = new Map({
    foo: 'bar',
    list: List.of(42),
  });

  var clonedImmutableList = clonedImmutable.List.of(1, 2, 3);

  describe('BDD interface', function () {
    describe('empty property', function () {
      it('should pass given an empty collection', function () {
        expect(new List()).to.be.empty;
      });

      it('should pass using `not` given a non-empty collection', function () {
        expect(list3).to.not.be.empty;
      });

      it('should not affect the original assertions', function () {
        expect([]).to.be.empty;
        expect('').to.be.empty;
        expect({}).to.be.empty;
      });

      it('should fail given a non-empty collection', function () {
        fail(function () { expect(list3).to.be.empty; });
      });

      it('should fail using `not` given an empty collection', function () {
        fail(function () { expect(new List()).to.not.be.empty; });
      });

      it('should work if using different copies of Immutable', function () {
        expect(clonedImmutable.List()).to.be.empty;
      });
    });

    describe('equal method', function () {
      it('should pass given equal values', function () {
        expect(list3).to.equal(List.of(1, 2, 3));
      });

      it('should pass using `not` given different values', function () {
        expect(list3).to.not.equal(new List());
      });

      it('aliases of equal should also work', function () {
        expect(list3).to.equal(List.of(1, 2, 3));
        expect(list3).to.not.equal(new List());
        expect(list3).to.equals(List.of(1, 2, 3));
        expect(list3).to.not.equals(new List());
        expect(list3).to.eq(List.of(1, 2, 3));
        expect(list3).to.not.eq(new List());
        expect(list3).to.eql(List.of(1, 2, 3));
        expect(list3).to.eqls(List.of(1, 2, 3));
        expect(list3).to.not.eql(new List());
        expect(list3).to.not.eqls(new List());
        expect(list3).to.deep.equal(List.of(1, 2, 3));
        expect(list3).to.not.deep.equal(new List());
      });

      it('should not affect the original assertions', function () {
        expect('hello').to.equal('hello');
        expect(42).to.equal(42);
        expect(1).to.not.equal(true);
        expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });
        expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });
      });

      it('should pass given deeply equal values', function () {
        expect(deepMap).to.equal(sameDeepMap);
        expect(deepMap).to.equals(sameDeepMap);
        expect(deepMap).to.eq(sameDeepMap);
        expect(deepMap).to.eql(sameDeepMap);
        expect(deepMap).to.eqls(sameDeepMap);
        expect(deepMap).to.deep.equal(sameDeepMap);
      });

      it('should pass using `not` given deeply different values', function () {
        expect(deepMap).to.not.equal(differentDeepMap);
        expect(deepMap).to.not.equals(differentDeepMap);
        expect(deepMap).to.not.eq(differentDeepMap);
        expect(deepMap).to.not.eql(differentDeepMap);
        expect(deepMap).to.not.eqls(differentDeepMap);
        expect(deepMap).to.not.deep.equal(differentDeepMap);
      });

      it('should pass using `not` given a non-Immutable value', function () {
        expect([]).to.not.equal(List());
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () {
        var actual = new Map({ foo: 'foo foo foo foo foo foo foo foo' });
        var expected = new Map({ bar: 'bar bar bar bar bar bar bar bar' });
        fail(function () {
          expect(actual).to.equal(expected);
        }, /(foo ?){8}.+(bar ?){8}/);
      });

      it('should fail given a non-Immutable value', function () {
        fail(function () { expect([]).to.equal(List()); });
      });

      it('should fail given different values', function () {
        fail(function () { expect(list3).to.equal(new List()); });
      });

      it('should fail using `not` given equal values', function () {
        fail(function () { expect(list3).to.not.equal(List.of(1, 2, 3)); });
      });

      it('should fail given deeply different values', function () {
        fail(function () { expect(deepMap).to.equal(differentDeepMap); });
        fail(function () { expect(deepMap).to.equals(differentDeepMap); });
        fail(function () { expect(deepMap).to.eq(differentDeepMap); });
        fail(function () { expect(deepMap).to.eql(differentDeepMap); });
        fail(function () { expect(deepMap).to.eqls(differentDeepMap); });
        fail(function () { expect(deepMap).to.deep.equal(differentDeepMap); });
      });

      it('should fail using `not` given deeply equal values', function () {
        fail(function () { expect(deepMap).to.not.equal(sameDeepMap); });
        fail(function () { expect(deepMap).to.not.equals(sameDeepMap); });
        fail(function () { expect(deepMap).to.not.eq(sameDeepMap); });
        fail(function () { expect(deepMap).to.not.eql(sameDeepMap); });
        fail(function () { expect(deepMap).to.not.eqls(sameDeepMap); });
        fail(function () { expect(deepMap).to.not.deep.equal(sameDeepMap); });
      });

      it('should work if using different copies of Immutable', function () {
        expect(clonedImmutableList).to.equal(List.of(1, 2, 3));
      });
    });

    describe('include method', function () {
      it('should pass given an existing value', function () {
        expect(new List([1, 2, 3])).to.include(2);
      });

      it('should pass using `not` given an inexisting value', function () {
        expect(new List([1, 2, 3])).to.not.include(42);
      });

      it('should chain and pass given an existing key', function () {
        expect(new Map({
          foo: 'bar',
          hello: 'universe',
        })).to.include.keys('foo');
      });

      it('should chain and pass using `not` given an inexisting key', function () {
        expect(new Map({
          foo: 'bar',
          hello: 'universe',
        })).to.not.include.keys('not-foo');
      });

      it('aliases of include should also work', function () {
        expect(new List([1, 2, 3])).contain(2);
        expect(new List([1, 2, 3])).not.contain(42);
        expect(new List([1, 2, 3])).contains(2);
        expect(new List([1, 2, 3])).not.contains(42);
        expect(new List([1, 2, 3])).includes(2);
        expect(new List([1, 2, 3])).not.includes(42);
      });

      it('should not affect the original assertions', function () {
        expect([1, 2, 3]).to.include(2);
        expect('foobar').to.contain('foo');
        expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () {
        var lengthyMap = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        fail(function () {
          expect(lengthyMap).to.include('not-foo');
        }, /(foo ){8}/);
      });

      it('should fail given an inexisting value', function () {
        fail(function () { expect(new List([1, 2, 3])).to.include(42); });
      });

      it('should fail using `not` given an existing value', function () {
        fail(function () { expect(new List([1, 2, 3])).not.to.include(2); });
      });

      it('should chain and fail given an inexisting key', function () {
        fail(function () {
          expect(new Map({
            foo: 'bar',
            hello: 'universe',
          })).to.include.keys('not-foo');
        });
      });

      it('should chain and fail using `not` given an existing key', function () {
        fail(function () {
          expect(new Map({
            foo: 'bar',
            hello: 'universe',
          })).to.not.include.keys('foo');
        });
      });
    });

    describe('keys method', function () {
      var map = new Map({ x: 1, y: 2 });
      var obj = { x: 1, y: 2 };

      it('should pass given an existing key', function () {
        expect(new Map({ x: 1 })).to.have.key('x');
        expect({ x: 1 }).to.have.key('x');
      });

      it('should pass using `not` given an inexisting key', function () {
        expect(map).to.not.have.key('z');
        expect(obj).to.not.have.key('z');
      });

      it('should pass given multiple existing keys', function () {
        expect(map).to.have.keys('x', 'y');
        expect(obj).to.have.keys('x', 'y');
      });

      it('should pass using `not` given multiple inexisting keys', function () {
        expect(map).to.not.have.keys('z1', 'z2');
        expect(obj).to.not.have.keys('z1', 'z2');
      });

      it('should accept an Array of keys to check against', function () {
        expect(map).to.have.keys(['x', 'y']);
        expect(obj).to.have.keys(['x', 'y']);
      });

      it('should accept a List of keys to check against', function () {
        expect(map).to.have.keys(new List(['x', 'y']));
      });

      it('should accept a Set of keys to check against', function () {
        expect(map).to.have.keys(new Set(['x', 'y']));
      });

      it('should accept a Stack of keys to check against', function () {
        expect(map).to.have.keys(new Stack(['x', 'y']));
      });

      it('should accept an Object to check against', function () {
        expect(map).to.have.keys({ 'x': 6, 'y': 7 });
        expect(obj).to.have.keys({ 'x': 6, 'y': 7 });
      });

      it('should accept a Map to check against', function () {
        expect(map).to.have.keys(new Map({ 'x': 6, 'y': 7 }));
      });

      it('should pass using `any` given an existing key', function () {
        expect(map).to.have.any.keys('x', 'z');
        expect(obj).to.have.any.keys('x', 'z');
      });

      it('should pass using `not` and `any` given inexisting keys', function () {
        expect(map).to.not.have.any.keys('z1', 'z2');
        expect(obj).to.not.have.any.keys('z1', 'z2');
      });

      it('should pass using `all` given existing keys', function () {
        expect(map).to.have.all.keys('x', 'y');
        expect(obj).to.have.all.keys('x', 'y');
      });

      it('should pass using `not` and `all` given inexisting keys', function () {
        expect(map).to.not.have.all.keys('z1', 'y');
        expect(obj).to.not.have.all.keys('z1', 'y');
      });

      it('should pass using `contain` given an existing key', function () {
        expect(map).to.contain.key('x');
        expect(obj).to.contain.key('x');
      });

      it('should not affect the original assertions', function () {
        expect({ x: 1, y: 2 }).to.have.any.keys('x', 'z');
        expect({ x: 1, y: 2 }).to.have.any.keys('x');
        expect({ x: 1, y: 2 }).to.contain.any.keys('y', 'z');
        expect({ x: 1, y: 2 }).to.contain.any.keys(['x']);
        expect({ x: 1, y: 2 }).to.contain.any.keys({ 'x': 6 });
        expect({ x: 1, y: 2 }).to.have.all.keys(['x', 'y']);
        expect({ x: 1, y: 2 }).to.have.all.keys({ 'x': 6, 'y': 7 });
        expect({ x: 1, y: 2, z: 3 }).to.contain.all.keys(['x', 'y']);
        expect({ x: 1, y: 2, z: 3 }).to.contain.all.keys({ 'x': 6 });
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () {
        var lengthyMap = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        fail(function () {
          expect(lengthyMap).to.have.keys('not-foo');
        }, /(foo ){8}/);
      });

      it('should fail given an inexisting key', function () {
        fail(function () { expect(new Map({ x: 1 })).to.have.key('z'); });
        fail(function () { expect({ x: 1 }).to.have.key('z'); });
      });

      it('should fail using `not` given an inexisting key', function () {
        fail(function () { expect(map).to.not.have.key('x'); });
        fail(function () { expect(obj).to.not.have.key('x'); });
      });

      it('should fail given multiple inexisting keys', function () {
        fail(function () { expect(map).to.have.keys('z1', 'z2'); });
        fail(function () { expect(obj).to.have.keys('z1', 'z2'); });
      });

      it('should fail using `not` given multiple existing keys', function () {
        fail(function () { expect(map).to.not.have.keys('x', 'y'); });
        fail(function () { expect(obj).to.not.have.keys('x', 'y'); });
      });

      it('should fail using `any` given inexisting keys', function () {
        fail(function () { expect(map).to.have.any.keys('z1', 'z2'); });
        fail(function () { expect(obj).to.have.any.keys('z1', 'z2'); });
      });

      it('should fail using `not` and `any` given an existing key', function () {
        fail(function () { expect(map).to.not.have.any.keys('x', 'z'); });
        fail(function () { expect(obj).to.not.have.any.keys('x', 'z'); });
      });

      it('should fail using `all` given an inexisting key', function () {
        fail(function () { expect(map).to.have.all.keys('z1', 'y'); });
        fail(function () { expect(obj).to.have.all.keys('z1', 'y'); });
      });

      it('should fail using `not` and `all` given existing keys', function () {
        fail(function () { expect(map).to.not.have.all.keys('x', 'y'); });
        fail(function () { expect(obj).to.not.have.all.keys('x', 'y'); });
      });

      it('should fail using `contain` given an inexisting key', function () {
        fail(function () { expect(map).to.contain.key('z'); });
        fail(function () { expect(obj).to.contain.key('z'); });
      });

      it('should work if using different copies of Immutable', function () {
        expect(clonedImmutable.Map({ x: 1 })).to.have.key('x');
      });
    });

    describe('property property', function () {
      it('should not affect the original assertion', function () {
        expect({ x: 1 }).to.have.property('x', 1);
      });

      it('should fail given an inexisting property', function () {
        var obj = Immutable.fromJS({ x: 1 });
        fail(function () { expect(obj).to.have.property('z'); });
      });

      it('should pass using `not` given an inexisting property', function () {
        var obj = Immutable.fromJS({ x: 1 });
        expect(obj).not.to.have.property('z');
      });

      it('should pass given an existing property', function () {
        var obj = Immutable.fromJS({ x: 1 });
        expect(obj).to.have.property('x');
      });

      it('should fail using `not` given an existing property', function () {
        var obj = Immutable.fromJS({ x: 1 });
        fail(function () { expect(obj).not.to.have.property('x'); });
      });

      it('should fail given a property with a bad value', function () {
        var obj = Immutable.fromJS({ x: 1 });
        fail(function () { expect(obj).to.have.property('x', 'different'); });
      });

      it('should pass given a property with the good value', function () {
        var obj = Immutable.fromJS({ x: 1 });
        expect(obj).to.have.property('x', 1);
      });

      it('should pass given an immutable value', function () {
        var obj = Immutable.fromJS({ foo: { bar: 42 } });
        expect(obj).to.have.property('foo', new Map({ bar: 42 }));
      });

      it('should change the subject to the value of that property', function () {
        var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
        var sub = obj.get('y');
        expect(obj).to.have.property('y').that.equal(sub);
      });

      describe('using the `deep` flag', function () {
        it('should not affect the original assertion', function () {
          expect({ x: 1, y: { x: 2, y: 3 } }).to.have.deep.property('y.x', 2);
        });

        it('should fail given an inexisting property', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          fail(function () { expect(obj).to.have.deep.property(['y', 'z']); });
        });

        it('should pass using `not` given an inexisting property', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          expect(obj).not.to.have.deep.property(['y', 'z']);
        });

        it('should pass given an existing property', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          expect(obj).to.have.deep.property(['y', 'x']);
        });

        it('should pass given an index', function () {
          var obj = Immutable.fromJS({
            items: ['a', 'b', 'c'],
          });
          expect(obj).to.have.deep.property(['items', 2], 'c');
        });

        it('should fail using `not` given an existing property', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          fail(function () { expect(obj).not.to.have.deep.property(['y', 'x']); });
        });

        it('should fail given a property with a bad value', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          fail(function () {
            expect(obj).to.have.property(['y', 'x'], 'different');
          });
        });

        it('should pass given a property with the good value', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
          expect(obj).to.have.deep.property(['y', 'x'], 2);
        });

        it('should fail using `not` given an inexisting property', function () {
          var obj = Immutable.fromJS({ x: 1 });
          fail(function () {
            expect(obj).not.to.have.deep.property(['y', 'x'], 'different');
          });
        });

        it('should fail using `not` given a property with good value', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2 } });
          fail(function () {
            expect(obj).not.to.have.deep.property(['y', 'x'], 2);
          });
        });

        it('should pass using `not` given a property with a bad value', function () {
          var obj = Immutable.fromJS({ x: 1, y: { x: 2 } });
          expect(obj).not.to.have.deep.property(['y', 'x'], 'different');
        });

        it('should pass given an immutable value', function () {
          var obj = Immutable.fromJS({ foo: [{ bar: 42 }] });
          expect(obj).to.have.deep.property('foo[0]', new Map({ bar: 42 }));
        });
      });

      describe('given a string-based path', function () {
        var obj = Immutable.fromJS({
          items: [
            { name: 'Jane' },
            { name: 'John' },
            { name: 'Jim' },
          ],
        });

        it('should pass using `deep` given a single index', function () {
          expect(obj.get('items')).to.have.deep.property('[1]')
            .that.equals(new Map({ name: 'John' }));
        });

        it('should pass using `deep` given a single key', function () {
          expect(obj).to.have.deep.property('items')
            .that.equals(new List([
              new Map({ name: 'Jane' }),
              new Map({ name: 'John' }),
              new Map({ name: 'Jim' }),
            ]));
        });

        it('should pass using `deep` starting with an index', function () {
          expect(obj.get('items')).to.have.deep.property('[0].name', 'Jane');
        });

        it('should pass using `deep` ending with an index', function () {
          expect(obj).to.have.deep.property('items[1]')
            .that.equals(new Map({ name: 'John' }));
        });

        it('should pass using `deep` given a mix of keys and indices', function () {
          expect(obj).to.have.deep.property('items[2].name', 'Jim');
        });

        it('should expect unescaped path strings', function () {
          var css = new Map({ '.link[target]': 42 });
          expect(css).to.have.property('.link[target]', 42);
        });

        it('should expect escaped path strings using `deep`', function () {
          var deepCss = new Map({ '.link': new Map({ '[target]': 42 }) });
          expect(deepCss).to.have.deep.property('\\.link.\\[target\\]', 42);
        });
      });
    });

    describe('size method', function () {
      it('should pass given the right size', function () {
        expect(list3).to.have.size(3);
      });

      it('should pass using `not` given the wrong size', function () {
        expect(list3).to.not.have.size(42);
      });

      it('should also work with alias sizeOf', function () {
        expect(list3).to.have.sizeOf(3);
        expect(list3).to.not.have.sizeOf(42);
      });

      it('should fail given the wrong size', function () {
        fail(function () { expect(list3).to.have.size(42); });
      });

      it('should fail using `not` given the right size', function () {
        fail(function () { expect(list3).to.not.have.size(3); });
      });

      it('should work if using different copies of Immutable', function () {
        expect(clonedImmutableList).to.have.size(3);
      });
    });

    describe('size property', function () {
      it('above should pass given a good min size', function () {
        expect(list3).to.have.size.above(2);
      });

      it('above should pass using `not` given a bad min size', function () {
        expect(list3).to.not.have.size.above(42);
      });

      it('aliases of above should also work', function () {
        expect(list3).to.have.size.gt(2);
        expect(list3).to.have.size.greaterThan(2);
        expect(list3).to.not.have.size.gt(42);
        expect(list3).to.not.have.size.greaterThan(42);
      });

      it('should not affect the original assertions of above', function () {
        expect('foo').to.have.length.above(2);
        expect([1, 2, 3]).to.have.length.above(2);
      });

      it('above should fail given a bad min size', function () {
        fail(function () { expect(list3).to.have.size.above(42); });
      });

      it('above should fail using `not` given a good min size', function () {
        fail(function () { expect(list3).to.not.have.size.above(2); });
      });

      it('below should pass given a good max size', function () {
        expect(list3).to.have.size.below(42);
      });

      it('below should pass using `not` given a bad max size', function () {
        expect(list3).to.not.have.size.below(1);
      });

      it('aliases of below should also work', function () {
        expect(list3).to.have.size.lt(4);
        expect(list3).to.have.size.lessThan(4);
        expect(list3).to.not.have.size.lt(1);
        expect(list3).to.not.have.size.lessThan(1);
      });

      it('should not affect the original assertions of below', function () {
        expect('foo').to.have.length.below(4);
        expect([1, 2, 3]).to.have.length.below(4);
      });

      it('below should fail given a bad max size', function () {
        fail(function () { expect(list3).to.have.size.below(1); });
      });

      it('below should fail using `not` given a good max size', function () {
        fail(function () { expect(list3).to.not.have.size.below(42); });
      });

      it('within should pass given a good range', function () {
        expect(list3).to.have.size.within(2, 42);
      });

      it('within should pass using `not` given a bad range', function () {
        expect(list3).to.not.have.size.within(10, 20);
      });

      it('should not affect the original assertions of within', function () {
        expect('foo').to.have.length.within(2, 4);
        expect([1, 2, 3]).to.have.length.within(2, 4);
      });

      it('within should fail given a bad range', function () {
        fail(function () { expect(list3).to.have.size.within(10, 20); });
      });

      it('within should fail using `not` given a good range', function () {
        fail(function () { expect(list3).to.not.have.size.within(2, 42); });
      });

      it('least should pass given a good min size', function () {
        expect(list3).to.have.size.of.at.least(2);
      });

      it('least should pass using `not` given a bad min size', function () {
        expect(list3).to.not.have.size.of.at.least(42);
      });

      it('aliases of least should also work', function () {
        expect(list3).to.have.size.gte(2);
        expect(list3).to.not.have.size.gte(42);
      });

      it('should not affect the original assertions of least', function () {
        expect('foo').to.have.length.of.at.least(2);
        expect([1, 2, 3]).to.have.length.of.at.least(3);
      });

      it('least should fail given a bad min size', function () {
        fail(function () { expect(list3).to.have.size.of.at.least(42); });
      });

      it('least should fail using `not` given a good min size', function () {
        fail(function () { expect(list3).to.not.have.size.of.at.least(2); });
      });

      it('most should pass given a good max size', function () {
        expect(list3).to.have.size.of.at.most(42);
      });

      it('most should pass using `not` given a bad max size', function () {
        expect(list3).to.not.have.size.of.at.most(2);
      });

      it('aliases of most should also work', function () {
        expect(list3).to.have.size.lte(42);
        expect(list3).to.not.have.size.lte(2);
      });

      it('should not affect the original assertions of most', function () {
        expect('foo').to.have.length.of.at.most(4);
        expect([1, 2, 3]).to.have.length.of.at.most(3);
      });

      it('most should fail given a good max size', function () {
        fail(function () { expect(list3).to.have.size.of.at.most(2); });
      });

      it('most should fail using `not` given a bad max size', function () {
        fail(function () { expect(list3).to.not.have.size.of.at.most(42); });
      });

      it('should work if using different copies of Immutable', function () {
        expect(clonedImmutableList).to.have.size.above(2);
      });
    });
  });

  describe('TDD interface', function () {
    describe('equal assertion', function () {
      it('should pass given equal values', function () {
        assert.equal(list3, List.of(1, 2, 3));
      });

      it('should pass given deeply equal values', function () {
        assert.equal(deepMap, sameDeepMap);
      });

      it('should not affect the original assertion', function () {
        assert.equal(42, 42);
        assert.equal(3, '3');
      });

      // See https://github.com/astorije/chai-immutable/issues/7
      it('should display a helpful failure output on big objects', function () {
        var actual = new Map({ foo: 'foo foo foo foo foo foo foo foo ' });
        var expected = new Map({ bar: 'bar bar bar bar bar bar bar bar ' });
        fail(function () {
          assert.equal(actual, expected);
        }, /(foo ){8}.+(bar ){8}/);
      });

      it('should fail given a non-Immutable value', function () {
        fail(function () { assert.equal([], List()); });
      });

      it('should fail given different values', function () {
        fail(function () { assert.equal(list3, new List()); });
      });

      it('should fail given deeply different values', function () {
        fail(function () { assert.equal(deepMap, differentDeepMap); });
      });

      it('should work if using different copies of Immutable', function () {
        assert.equal(clonedImmutableList, List.of(1, 2, 3));
      });
    });

    describe('notEqual assertion', function () {
      it('should pass given different values', function () {
        assert.notEqual(list3, new List());
      });

      it('should pass given deeply different values', function () {
        assert.notEqual(deepMap, differentDeepMap);
      });

      it('should not affect the original assertion', function () {
        assert.notEqual('oui', 'non');
        assert.notEqual({ foo: 'bar' }, { foo: 'bar' });
      });

      it('should pass given a non-Immutable value', function () {
        assert.notEqual([], List());
      });

      it('should fail given equal values', function () {
        fail(function () { assert.notEqual(list3, List.of(1, 2, 3)); });
      });

      it('should fail given deeply equal values', function () {
        fail(function () { assert.notEqual(deepMap, sameDeepMap); });
      });

      it('should work if using different copies of Immutable', function () {
        assert.notEqual(clonedImmutableList, List.of());
      });
    });

    describe('unoverridden strictEqual and deepEqual assertions', function () {
      it('should pass given equal values', function () {
        assert.strictEqual(list3, List.of(1, 2, 3));
        assert.deepEqual(list3, List.of(1, 2, 3));
      });

      it('should pass given deeply equal values', function () {
        assert.strictEqual(deepMap, sameDeepMap);
        assert.deepEqual(deepMap, sameDeepMap);
      });

      it('should fail given different values', function () {
        fail(function () { assert.strictEqual(list3, new List()); });
        fail(function () { assert.deepEqual(list3, new List()); });
      });

      it('should fail given deeply different values', function () {
        fail(function () { assert.strictEqual(deepMap, differentDeepMap); });
        fail(function () { assert.deepEqual(deepMap, differentDeepMap); });
      });

      it('should work if using different copies of Immutable', function () {
        assert.strictEqual(clonedImmutableList, List.of(1, 2, 3));
        assert.deepEqual(clonedImmutableList, List.of(1, 2, 3));
      });
    });

    describe('unoverridden notStrictEqual and notDeepEqual assertions', function () {
      it('should pass given different values', function () {
        assert.notStrictEqual(list3, new List());
        assert.notDeepEqual(list3, new List());
      });

      it('should pass given deeply different values', function () {
        assert.notStrictEqual(deepMap, differentDeepMap);
        assert.notDeepEqual(deepMap, differentDeepMap);
      });

      it('should fail given equal values', function () {
        fail(function () { assert.notStrictEqual(list3, List.of(1, 2, 3)); });
        fail(function () { assert.notDeepEqual(list3, List.of(1, 2, 3)); });
      });

      it('should fail given deeply equal values', function () {
        fail(function () { assert.notStrictEqual(deepMap, sameDeepMap); });
        fail(function () { assert.notDeepEqual(deepMap, sameDeepMap); });
      });

      it('should work if using different copies of Immutable', function () {
        assert.notStrictEqual(clonedImmutableList, List());
        assert.notDeepEqual(clonedImmutableList, List());
      });
    });

    describe('property assertions', function () {
      it('should fail for missing property', function () {
        var obj = Immutable.fromJS({ x: 1 });
        fail(function () { assert.property(obj, 'z'); });
      });

      it('should succeed for equal deep property', function () {
        var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
        assert.deepProperty(obj, ['y', 'x']);
      });

      it('should fail for unequal deep property', function () {
        var obj = Immutable.fromJS({ x: 1, y: { x: 2, y: 3 } });
        fail(function () { assert.deepPropertyVal(obj, ['y', 'x'], 'different'); });
      });
    });

    describe('sizeOf assertion', function () {
      it('should pass given the right size', function () {
        assert.sizeOf(list3, 3);
      });

      it('should work with empty collections', function () {
        assert.sizeOf(new List(), 0);
      });

      it('should fail given the wrong size', function () {
        fail(function () { assert.sizeOf(list3, 42); });
      });

      it('should work if using different copies of Immutable', function () {
        assert.sizeOf(clonedImmutableList, 3);
      });
    });
  });
});
