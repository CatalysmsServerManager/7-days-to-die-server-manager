const expect = require('chai').expect;
const replyTypes = require('../../worker/processors/sdtdCommands/replyTypes');

describe('HELPER Command reply types', () => {
  it('Returns an array', () => {
    return expect(replyTypes).to.be.an('array');
  });
  it('Does not contain duplicate types', () => {

    const currentTypes = replyTypes.map(o => o.type);
    const unique = new Set();

    currentTypes.forEach(function (type) {
      if (!unique.has(type)) {unique.add(type);}
    });

    return expect([...unique]).to.eql(currentTypes);
  });
});
