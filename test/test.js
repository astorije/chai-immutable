'use strict';

var chai = require('chai');
var chaiImmutable = require('../chai-immutable');
var expect = chai.expect;
var List = require('immutable').List;

chai.use(chaiImmutable);

describe('chai-immutable', function () {
  var list3 = List([1, 2, 3]);

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
});
