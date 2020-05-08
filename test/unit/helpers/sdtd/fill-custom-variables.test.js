const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

describe('HELPER sdtd/fill-custom-variables', () => {
  it('silently works when undefined data is provided', async () => {
    const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${player.friendlyName}', {} );
    expect(result).to.be.eql('whoa there ${player.friendlyName}');
  });
  it('simple replacements work', async () => {
    const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${friendlyName}', { friendlyName: 'halkeye' } );
    expect(result).to.be.eql('whoa there halkeye');
  });
  it('nested replacements work', async () => {
    const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${player.friendlyName}', { player: { friendlyName: 'halkeye' } } );
    expect(result).to.be.eql('whoa there halkeye');
  });
});

