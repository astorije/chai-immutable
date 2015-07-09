'use strict';

var chai = require('chai');
var chaiImmutable = require('../chai-immutable');
var assert = chai.assert;
var expect = chai.expect;
var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;
var Set = Immutable.Set;
var Stack = Immutable.Stack;

chai.use(chaiImmutable);

describe('chai-immutable', function () {
  var list3 = List.of(1, 2, 3);

  describe('BDD interface', function () {
    describe('empty property', function () {
      it('should be true when given an empty collection', function () {
        expect(new List()).to.be.empty;
      });

      it('should be false when given a non-empty collection', function () {
        expect(list3).to.not.be.empty;
      });

      it('should not affect the original assertions', function () {
        expect([]).to.be.empty;
        expect('').to.be.empty;
        expect({}).to.be.empty;
      });
    });

    describe('equal method', function () {
      it(
        'should fail when only the "expected" value is an Immutable collection',
        function () {
          var fn = function () { expect([]).to.equal(List()); };
          expect(fn).to.throw(Error);
        }
      );

      it('should be true when compared structure is equal', function () {
        expect(list3).to.equal(List.of(1, 2, 3));
      });

      it('should be false when compared structure not equal', function () {
        expect(list3).to.not.equal(new List());
      });

      it('aliases of equal should also work', function () {
        expect(list3).to.equal(List.of(1, 2, 3));
        expect(list3).to.not.equal(new List());
        expect(list3).to.equals(List.of(1, 2, 3));
        expect(list3).to.not.equals(new List());
        expect(list3).to.eq(List.of(1, 2, 3));
        expect(list3).to.not.eq(new List());
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
    });

    describe('include method', function () {
      it('should be true with an existing value', function () {
        expect(new List([1, 2, 3])).to.include(2);
      });

      it('should be false with an inexisting value', function () {
        expect(new List([1, 2, 3])).to.not.include(42);
      });

      it('should chain and be true with existing keys', function () {
        expect(new Map({
          foo: 'bar',
          hello: 'universe'
        })).to.include.keys('foo');
      });

      it('should chain and be false with inexisting keys', function () {
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
      var mapFoobar = new Map({ foo: 1, bar: 2 });
      var objectFoobar = { foo: 1, bar: 2 };

      it('should be true when given an existing key', function () {
        expect(new Map({ foo: 1 })).to.have.key('foo');
        expect({ foo: 1 }).to.have.key('foo');
      });

      it('should be false when given a non existing key', function () {
        expect(mapFoobar).to.not.have.key('notfoo');
        expect(objectFoobar).to.not.have.key('notfoo');
      });

      it('should be true when given multiple existing keys', function () {
        expect(mapFoobar).to.have.keys('foo', 'bar');
        expect(objectFoobar).to.have.keys('foo', 'bar');
      });

      it('should be false when given multiple non existing keys', function () {
        expect(mapFoobar).to.not.have.keys('not-foo', 'not-bar');
        expect(objectFoobar).to.not.have.keys('not-foo', 'not-bar');
      });

      it('should accept an Array of keys to check against', function () {
        expect(mapFoobar).to.have.keys(['bar', 'foo']);
        expect(objectFoobar).to.have.keys(['bar', 'foo']);
      });

      it('should accept an List of keys to check against', function () {
        expect(mapFoobar).to.have.keys(new List(['bar', 'foo']));
      });

      it('should accept an Set of keys to check against', function () {
        expect(mapFoobar).to.have.keys(new Set(['bar', 'foo']));
      });

      it('should accept an Stack of keys to check against', function () {
        expect(mapFoobar).to.have.keys(new Stack(['bar', 'foo']));
      });

      it('should accept an Object to check against', function () {
        expect(mapFoobar).to.have.keys({ 'bar': 6, 'foo': 7 });
        expect(objectFoobar).to.have.keys({ 'bar': 6, 'foo': 7 });
      });

      it('should accept a Map to check against', function () {
        expect(mapFoobar).to.have.keys(new Map({ 'bar': 6, 'foo': 7 }));
      });

      it('should be true when used with any and an existing key', function () {
        expect(mapFoobar).to.have.any.keys('foo', 'not-foo');
        expect(objectFoobar).to.have.any.keys('foo', 'not-foo');
      });

      it('should be false when used with any and inexisting keys', function () {
        expect(mapFoobar).to.not.have.any.keys('not-foo', 'not-bar');
        expect(objectFoobar).to.not.have.any.keys('not-foo', 'not-bar');
      });

      it('should be true when used with all and existing keys', function () {
        expect(mapFoobar).to.have.all.keys('foo', 'bar');
        expect(objectFoobar).to.have.all.keys('foo', 'bar');
      });

      it('should be false when used with all and inexisting keys', function () {
        expect(mapFoobar).to.not.have.all.keys('not-foo', 'bar');
        expect(objectFoobar).to.not.have.all.keys('not-foo', 'bar');
      });

      it('should be true when used with contain and an existing key', function () {
        expect(mapFoobar).to.contain.key('foo');
        expect(objectFoobar).to.contain.key('foo');
      });

      it('should not affect the original assertions', function () {
        expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');
        expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');
        expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');
        expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);
        expect({ foo: 1, bar: 2 }).to.contain.any.keys({ 'foo': 6 });
        expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);
        expect({ foo: 1, bar: 2 }).to.have.all.keys({ 'bar': 6, 'foo': 7 });
        expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);
        expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys({ 'bar': 6 });
      });
    });

    describe('size method', function () {
      it('should be true when given the right size', function () {
        expect(list3).to.have.size(3);
      });

      it('should be false when given the wrong size', function () {
        expect(list3).to.not.have.size(42);
      });

      it('should also work with alias sizeOf', function () {
        expect(list3).to.have.sizeOf(3);
        expect(list3).to.not.have.sizeOf(42);
      });
    });

    describe('size property', function () {
      it('above should be true when given a good min size', function () {
        expect(list3).to.have.size.above(2);
      });

      it('above should be false when given a bad min size', function () {
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

      it('below should be true when given a good max size', function () {
        expect(list3).to.have.size.below(42);
      });

      it('below should be false when given a bad max size', function () {
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

      it('within should be true when given a good range', function () {
        expect(list3).to.have.size.within(2, 42);
      });

      it('within should be false when given a bad range', function () {
        expect(list3).to.not.have.size.within(10, 20);
      });

      it('should not affect the original assertions of within', function () {
        expect('foo').to.have.length.within(2, 4);
        expect([1, 2, 3]).to.have.length.within(2, 4);
      });

      it('least should be true when given a good min size', function () {
        expect(list3).to.have.size.of.at.least(2);
      });

      it('least should be false when given a bad min size', function () {
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

      it('most should be true when given a good max size', function () {
        expect(list3).to.have.size.of.at.most(42);
      });

      it('most should be false when given a bad max size', function () {
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
      it(
        'should fail when only the "expected" value is an Immutable collection',
        function () {
          var fn = function () { assert.equal([], List()); };
          assert.throw(fn);
        }
      );

      it('should be true when compared structure is equal', function () {
        assert.equal(list3, List.of(1, 2, 3));
      });

      it('should be false when compared structure not equal', function () {
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
      it('should be true when compared structure is equal', function () {
        assert.strictEqual(list3, List.of(1, 2, 3));
        assert.deepEqual(list3, List.of(1, 2, 3));
      });

      it('should be false when compared structure not equal', function () {
        assert.notStrictEqual(list3, new List());
        assert.notDeepEqual(list3, new List());
      });
    });

    describe('sizeOf assertion', function () {
      it('should be true when given the right size', function () {
        assert.sizeOf(List.of(1, 2, 3), 3);
      });

      it('should work with empty collections', function () {
        assert.sizeOf(new List(), 0);
      });
    });
  });
});
