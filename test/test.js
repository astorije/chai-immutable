'use strict';

var typeEnv;
if (!chai) {
  var chai = require('chai');
  var chaiImmutable = require('../chai-immutable');
  var Immutable = require('immutable');

  chai.use(chaiImmutable);
  typeEnv = 'Node.js';
}
else typeEnv = 'PhantomJS';

var assert = chai.assert;
var expect = chai.expect;
var List = Immutable.List;
var Map = Immutable.Map;
var Set = Immutable.Set;
var Stack = Immutable.Stack;

describe('chai-immutable (' + typeEnv + ')', function () {
  var list3 = List.of(1, 2, 3);
  var deepMap = new Map({
    foo: 'bar',
    list: List.of(1, 2, 3)
  });

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
    });

    describe('equal method', function () {
      it('should fail given a non-Immutable value', function () {
        var fn = function () { expect([]).to.equal(List()); };
        expect(fn).to.throw(Error);
      });

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
        expect(list3).to.not.eql(new List());
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

      it('should work on deep structures that are equal', function () {
        var sameDeepMap = new Map({
          foo: 'bar',
          list: List.of(1, 2, 3)
        });

        expect(deepMap).to.equal(sameDeepMap);
        expect(deepMap).to.equals(sameDeepMap);
        expect(deepMap).to.eq(sameDeepMap);
        expect(deepMap).to.eql(sameDeepMap);
        expect(deepMap).to.deep.equal(sameDeepMap);
      });

      it('should work on deep structures that are not equal', function () {
        var differentDeepMap = new Map({
          foo: 'bar',
          list: List.of(42)
        });

        expect(deepMap).to.not.equal(differentDeepMap);
        expect(deepMap).to.not.equals(differentDeepMap);
        expect(deepMap).to.not.eq(differentDeepMap);
        expect(deepMap).to.not.eql(differentDeepMap);
        expect(deepMap).to.not.deep.equal(differentDeepMap);
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
          hello: 'universe'
        })).to.include.keys('foo');
      });

      it('should chain and pass using `not` given an inexisting key', function () {
        expect(new Map({
          foo: 'bar',
          hello: 'universe'
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
    });
  });

  describe('TDD interface', function () {
    describe('equal assertion', function () {
      it('should fail given a non-Immutable value', function () {
        var fn = function () { assert.equal([], List()); };
        assert.throw(fn);
      });

      it('should pass given equal values', function () {
        assert.equal(list3, List.of(1, 2, 3));
      });

      it('should pass given different values', function () {
        assert.notEqual(list3, new List());
      });

      it('should not affect the original assertion', function () {
        assert.equal(42, 42);
        assert.equal(3, '3');
        assert.notEqual('oui', 'non');
        assert.notEqual({ foo: 'bar' }, { foo: 'bar' });
      });
    });

    describe('unoverridden strictEqual and deepEqual assertions', function () {
      it('should pass given equal values', function () {
        assert.strictEqual(list3, List.of(1, 2, 3));
        assert.deepEqual(list3, List.of(1, 2, 3));
      });

      it('should pass given different values', function () {
        assert.notStrictEqual(list3, new List());
        assert.notDeepEqual(list3, new List());
      });
    });

    it('should work on deep structures that are equal', function () {
      var sameDeepMap = new Map({
        foo: 'bar',
        list: List.of(1, 2, 3)
      });

      assert.equal(deepMap, sameDeepMap);
      assert.strictEqual(deepMap, sameDeepMap);
      assert.deepEqual(deepMap, sameDeepMap);
    });

    it('should work on deep structures that are not equal', function () {
      var differentDeepMap = new Map({
        foo: 'bar',
        list: List.of(42)
      });

      assert.notEqual(deepMap, differentDeepMap);
      assert.notStrictEqual(deepMap, differentDeepMap);
      assert.notDeepEqual(deepMap, differentDeepMap);
    });

    describe('sizeOf assertion', function () {
      it('should pass given the right size', function () {
        assert.sizeOf(list3, 3);
      });

      it('should work with empty collections', function () {
        assert.sizeOf(new List(), 0);
      });
    });
  });
});
