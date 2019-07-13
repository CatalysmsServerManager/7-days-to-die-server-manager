var expect = require("chai").expect;

describe('HELPER Command reply types', () => {
  it('Returns an array', () => {
    return expect(sails.hooks.sdtdcommands.replyTypes).to.be.an('array');
  });
  it('Does not contain duplicate types', () => {

    const currentTypes = sails.hooks.sdtdcommands.replyTypes.map(o => o.type);
    const unique = new Set()

    currentTypes.forEach(function (type) {
      if (!unique.has(type)) unique.add(type)
    })

    return expect([...unique]).to.eql(currentTypes);
  });
});
