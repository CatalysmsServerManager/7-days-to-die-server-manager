const { expect } = require('chai');
const CSMMCommand = require('../../../../worker/util/CSMMCommand');

describe('CSMMCommand - getHelpers', function() {
  it('should return an array of helpers', function() {
    const helpers = CSMMCommand.getHelpers();
    for (const helper of helpers) {
      expect(helper.name).to.be.a('string');
      expect(helper.name).to.have.length.above(0);
      expect(helper.parameters).to.be.an('array');
    }
  });
});
