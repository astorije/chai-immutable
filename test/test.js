'use strict';

var chai = require('chai');
var chaiImmutable = require('../chai-immutable');
var assert = chai.assert;
var expect = chai.expect;
var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;

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

    describe('key method', function () {
      it('should be true when given a key that exists', function () {
        expect(new Map({ foo: 1, bar: 2 })).to.have.key('foo');
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
      })
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
