const throttledFunction = require('../../worker/util/throttledFunction');
const MockDate = require('mockdate');
const { expect } = require('chai');

describe('throttledFunction', function () {
  it('Throttles a function', async () => {
    const stub = sandbox.stub();

    const fn = throttledFunction(stub, 5, 3);

    MockDate.set(new Date('2020-12-21T03:24:00'));
    fn();
    fn();
    fn();
    fn();
    MockDate.set(new Date('2020-12-21T03:25:00'));
    fn();
    // These get blocked
    fn();
    fn();

    // These arent blocked anymore
    MockDate.set(new Date('2020-12-21T03:29:00'));
    fn();
    fn();

    expect(stub).to.have.callCount(7);
  });
});
