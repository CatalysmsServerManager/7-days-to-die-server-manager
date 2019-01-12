const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const Wait = require('../../../../api/lib/customFunctions/functions/Wait');
const validArgs = require('../../../inputs.js').customFunctions.valid.wait;
const invalidArgs = require('../../../inputs.js').customFunctions.invalid.wait;

describe('CLASS - Customfunction Wait', () => {

  describe('Wait#validateArgument', function () {

    for (const validArg of validArgs) {
      it(`Takes a number as argument  - ${validArg.toString()}`, async () => {
        expect(Wait.validateArgument(Wait.parseArguments(validArg))).to.be.eq(true);
      });
    }

    for (const invalidArg of invalidArgs) {
      it(`Correctly detects invalid arguments - ${invalidArg.toString()}`, async () => {
        expect(Wait.validateArgument(Wait.parseArguments(invalidArg))).to.be.eq(false);
      });
    }
  });

  describe('Wait#parseArgument', function () {

    for (const validArg of validArgs) {
      it(`Returns a number with valid args  - ${validArg.toString()}`, async () => {
        expect(Wait.parseArguments(validArg)).to.be.eq(parseInt(validArg[0]));
      });
    }

    for (const invalidArg of invalidArgs) {
      it(`Returns false for invalid arguments - ${invalidArg.toString()}`, async () => {
        expect(Wait.parseArguments(invalidArg)).to.be.eq(false);
      });
    }
  });

  describe('Wait#run', function () {
    it('returns after x seconds', async function () {
      let dateStarted = Date.now();
      await Wait.run(1);
      let dateEnded = Date.now();

      expect(dateEnded - dateStarted).to.be.greaterThan(999);
      expect(dateEnded - dateStarted).to.be.lessThan(1500);
    });
  });

  describe('Wait#execute', function () {
    it('returns after x seconds', async function () {
      let dateStarted = Date.now();
      let result = await Wait.execute(sails.testPlayer, sails.testServer, validArgs[0]);
      let dateEnded = Date.now();

      expect(dateEnded - dateStarted).to.be.greaterThan(999);
      expect(dateEnded - dateStarted).to.be.lessThan(1500);
      expect(result.status).to.be.true;
    });

    it('returns falsewhen invalid args given', async function () {

      let result = await Wait.execute(sails.testPlayer, sails.testServer, invalidArgs[0]);
      expect(result.status).to.be.false;
      expect(result.friendlyMessage).to.be.not.empty;
    });
  });
});
