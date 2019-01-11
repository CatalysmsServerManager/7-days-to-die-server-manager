const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const Wait = require('../../../../api/lib/customFunctions/functions/Wait');

describe('CLASS - Customfunction Wait', () => {
  describe('Wait#validateArgument', function () {
    it('Takes a number as argument', async () => {
      expect(Wait.validateArgument(3)).to.be.eq(true);
    });

    it('Returns false when given a string', async () => {
      expect(Wait.validateArgument("blabla")).to.be.eq(false);
    });

    it('Returns false when given a number smaller than 1', async () => {
      expect(Wait.validateArgument(0)).to.be.eq(false);
      expect(Wait.validateArgument(-5)).to.be.eq(false);
    });

    it('Returns false when given a number string', async () => {
      expect(Wait.validateArgument("3")).to.be.eq(false);
    });
    it('Returns false when given a boolean', async () => {
      expect(Wait.validateArgument(true)).to.be.eq(false);
    });
  });

  describe('Wait#parseArgument', function () {
    it('returns false when not an array is given', function () {
      expect(Wait.parseArguments(3)).to.be.eq(false);
    });

    it('returns number when an array with a number is given', function () {
      expect(Wait.parseArguments([3])).to.be.eq(3);
    });
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
      let result = await Wait.execute(undefined, undefined, undefined, [1]);
      let dateEnded = Date.now();

      expect(dateEnded - dateStarted).to.be.greaterThan(999);
      expect(dateEnded - dateStarted).to.be.lessThan(1500);
      expect(result.status).to.be.true;
    });

    it('returns falsewhen invalid args given', async function () {

      let result = await Wait.execute(undefined, undefined, undefined, 1);
      expect(result.status).to.be.false;
      expect(result.friendlyMessage).to.be.not.empty;
    });
  });
});
