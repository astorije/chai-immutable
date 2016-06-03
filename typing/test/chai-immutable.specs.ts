import {expect, use} from 'chai';
import {List} from 'immutable';

import * as chaiImmutable from './../../chai-immutable';

describe('Asserts', () => {
  before(() => use(chaiImmutable));
  
  let list = List.of('Trainspotting', '28 Days Later', 'Sunshine');
  
  describe('Given an Immutable collection', () => {
    it('we should be able to assert using ".size"', () => {
      expect(list).to.have.size.least(3);
    });

    it('we should be able to assert on "sizeOf"', () => {
      expect(list).to.have.sizeOf(3);
    });
  });
});
