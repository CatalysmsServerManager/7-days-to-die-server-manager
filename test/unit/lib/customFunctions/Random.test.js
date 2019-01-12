const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const Random = require('../../../../api/lib/customFunctions/functions/Random');

const validArgs = [
  ['testRandom'],
  ['testRandom', 1],
  ['testRandom', -8],
  ['testRandom', 1, 8],
  ['testRandom', -8, -4],
  ['testRandom', -8, 2],
];

const invalidArgs = [
  7,
  'invalid',
  [false],
  ['testRandom', "test"],
  ['testRandom', "test", 'test'],
  ['testRandom', false, 'test'],
  ['testRandom', "test", false],
]

describe('CLASS - Customfunction Random', () => {
  describe('Random#validateArgument', function () {
    for (const validArg of validArgs) {
      it(`Takes a name, min and max as arguments - ${validArg.toString()}`, async () => {
        expect(Random.validateArgument(Random.parseArguments(validArg))).to.be.eq(true);
      });
    }
    for (const invalidArg of invalidArgs) {
      it(`Correctly detects invalid arguments - ${invalidArg.toString()}`, async () => {
        expect(Random.validateArgument(Random.parseArguments(invalidArg))).to.be.eq(false);
      });
    }
  });

  describe('Random#parseArgument', function () {
    for (const invalidArg of invalidArgs) {
      it(`returns false when invalid args are given - ${invalidArg.toString()}`, function () {
        expect(Random.parseArguments(invalidArg)).to.be.eq(false);
      });
    }
    for (const validArg of validArgs) {
      it(`returns correct data when valid args are given - ${validArg.toString()}`, async function () {
        let result = Random.parseArguments(validArg);
        expect(result).to.not.be.false;
        if (!_.isUndefined(validArg[1])) {
          expect(result.min).to.be.an('number');
        }
        if (!_.isUndefined(validArg[2])) {
          expect(result.max).to.be.an('number');
        }
        expect(result.name).to.be.an('string');
        expect(result.name).to.be.not.empty;
      });
    }
  });

  describe('Random#run', function () {
    for (const validArg of validArgs) {
      it(`returns a correct random number - ${validArg.toString()}`, async function () {
        let arguments = Random.parseArguments(validArg);
        let result = await Random.run(arguments);

        expect(result).to.be.a('number');

        if (_.isNumber(arguments.min)) {
          expect(result).to.be.greaterThan(arguments.min - 1);
        }

        if (_.isNumber(arguments.max)) {
          expect(result).to.be.lessThan(arguments.max);
        }

      });
    }
  });

  describe('Random#execute', function () {

    for (const validArg of validArgs) {
      it(`returns a correct random number - ${validArg.toString()}`, async function () {
        let result = await Random.execute(undefined, sails.testPlayer, sails.testServer, validArg);

        expect(result.status).to.be.true;
        expect(result.result).to.be.a('number');

        if (_.isNumber(arguments.min)) {
          expect(result.result).to.be.greaterThan(arguments.min - 1);
        }

        if (_.isNumber(arguments.max)) {
          expect(result.result).to.be.lessThan(arguments.max + 1);
        }

      });
    }
  });
});
