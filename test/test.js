'use strict';

var chai = require('chai');
var chaiImmutable = require('../chai-immutable');
var expect = chai.expect;
var List = require('immutable').List;

chai.use(chaiImmutable);

describe('chai-immutable', function () {
  var list3 = List([1, 2, 3]);

  describe('empty property', function () {
    it('should be true when given an empty collection', function () {
      expect(List()).to.be.empty;
    });

    it('should be false when given a non-empty collection', function () {
      expect(list3).to.not.be.empty;
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

    it('within should be true when given a good range', function () {
      expect(list3).to.have.size.within(2, 42);
    });

    it('within should be false when given a bad range', function () {
      expect(list3).to.not.have.size.within(10, 20);
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
  });
});
