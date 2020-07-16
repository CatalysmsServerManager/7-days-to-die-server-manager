const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');

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
  describe('randList', () => {
    it('choices', async () => {
      const choices = ['a', 'b', 'c'];
      const words = await Promise.all(Array.from({ length: 1000 }, async () => {
        const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randList:' + choices.join(',') + '}', { } );
        return result.split(' ')[2];
      }));
      expect(words.every(n => choices.includes(n))).to.be.true;
    });
    it('single', async () => {
      const choices = ['a'];
      const words = await Promise.all(Array.from({ length: 1000 }, async () => {
        const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randList:' + choices.join(',') + '}', { } );
        return result.split(' ')[2];
      }));
      expect(words.every(n => choices.includes(n))).to.be.true;
    });
  });
  describe('randNum', () => {
    it('negatives', async () => {
      const start = -100;
      const end = 1;
      const numbers = await Promise.all(Array.from({ length: 1000 }, async () => {
        const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randNum:${start}:${end}}', { } );
        const matches = result.match(/(\d+)/);
        if (matches) {
          return parseInt(matches[1], 10);
        }
        return null;
      }));
      expect(numbers.every(n => n >= start)).to.be.true;
      expect(numbers.every(n => n <= end)).to.be.true;
    });
    it('min:max', async () => {
      const start = 1;
      const end = 100;
      const numbers = await Promise.all(Array.from({ length: 1000 }, async () => {
        const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randNum:1:100}', { } );
        const matches = result.match(/(\d+)/);
        if (matches) {
          return parseInt(matches[1], 10);
        }
        return null;
      }));
      expect(numbers.every(n => n >= start)).to.be.true;
      expect(numbers.every(n => n <= end)).to.be.true;
    });
    it('max:min', async () => {
      const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randNum:100:1}', { } );
      expect(result).to.be.eql('whoa there ${randNum:100:1}');
    });
    it('not enough variables', async () => {
      const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randNum:100}', { } );
      expect(result).to.be.eql('whoa there ${randNum:100}');
    });
    it('not numbers', async () => {
      const result = await sails.helpers.sdtd.fillCustomVariables('whoa there ${randNum:apple:orange}', { } );
      expect(result).to.be.eql('whoa there ${randNum:apple:orange}');
    });
  });
});

