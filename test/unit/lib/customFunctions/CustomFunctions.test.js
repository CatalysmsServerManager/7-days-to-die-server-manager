const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const customFunctions = require('../../../../api/lib/customFunctions');

describe('Class CustomFunctions#index', function () {
  describe('CustomFunctions#index.parseCommand()', function () {
    for (const functionToTest of customFunctions.functions) {
      const validArgs = require('../../../inputs.js').customFunctions.valid[functionToTest.key];
      const invalidArgs = require('../../../inputs.js').customFunctions.invalid[functionToTest.key];


      for (const validArg of validArgs) {
        it(`Returns correct for function "${functionToTest.key}" with args: ${validArg.toString()}`, async function () {
          const commandString = `${functionToTest.key}(${validArg.toString()})`;
          const parsedCommand = await customFunctions.parseCommand(commandString, {
            player: sails.testPlayer,
            server: sails.testServer
          });

          expect(parsedCommand).to.be.a('string');
        });
      }
    }
  });

});
