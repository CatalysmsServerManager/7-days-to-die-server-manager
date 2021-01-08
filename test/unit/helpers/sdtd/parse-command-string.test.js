var expect = require('chai').expect;

describe('HELPER sdtd/parse-command-string', () => {
  it('Returns an array', () => {
    const result = sails.helpers.sdtd.parseCommandsString('help; say test; another command');
    expect(result).to.be.an('array');
  });
  it('Gets rid of whitespace properly', () => {
    const result = sails.helpers.sdtd.parseCommandsString('help ; say test; another command;morecmds ;andmoar');
    expect(result).to.eql(['help', 'say test', 'another command', 'morecmds', 'andmoar']);
  });

  it('Splits on the right places', () => {
    const result = sails.helpers.sdtd.parseCommandsString('help; a "command that; is quoted"; say test');
    expect(result).to.eql(['help', 'a "command that; is quoted"', 'say test']);
  });

  it('Handles a ; at the end correctly', () => {
    const result = sails.helpers.sdtd.parseCommandsString('help; say test;');
    expect(result).to.eql(['help', 'say test']);
  });
});
