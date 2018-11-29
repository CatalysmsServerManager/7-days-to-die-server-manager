var expect = require("chai").expect;

describe('parse-command-string', () => {
  it('Returns an array', () => {
    let result = sails.helpers.sdtd.parseCommandsString("help; say test; another command");

    expect(result).to.be.an('array');
    expect(result).to.eql(["help", "say test", "another command"]);

  });
});
