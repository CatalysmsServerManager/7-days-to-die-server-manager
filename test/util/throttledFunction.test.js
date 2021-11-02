const throttledFunction = require('../../worker/util/throttledFunction');
const MockDate = require('mockdate');
const { expect } = require('chai');

describe('throttledFunction', function () {
  it('Throttles a function', async () => {
    const stub = sandbox.stub();

    const fn = throttledFunction(stub, 5, 3);

    MockDate.set(new Date('2020-12-21T03:24:00'));
    fn(1);
    fn(2);
    fn(3);
    fn(4);
    MockDate.set(new Date('2020-12-21T03:25:00'));
    fn(5);
    // These get blocked
    fn(6);
    fn(7);

    // These arent blocked anymore
    MockDate.set(new Date('2020-12-21T03:29:00'));
    fn(8);
    fn(9);

    expect(stub).to.have.callCount(7);
  });

  it('Works accross hours', async () => {
    const stub = sandbox.stub();

    const fn = throttledFunction(stub, 5, 3);

    MockDate.set(new Date('2020-12-21T03:56:00'));
    fn(1);
    MockDate.set(new Date('2020-12-21T03:57:00'));
    fn(2);
    fn(3);
    fn(4);
    MockDate.set(new Date('2020-12-21T03:58:00'));
    fn(5);
    MockDate.set(new Date('2020-12-21T03:59:00'));
    fn(6);

    fn(7);

    // These arent blocked anymore
    MockDate.set(new Date('2020-12-21T04:01:00'));
    fn(8);
    fn(9);

    expect(stub).to.have.callCount(7);
    expect(stub).to.have.been.calledWith(1);
    expect(stub).to.have.been.calledWith(2);
    expect(stub).to.have.been.calledWith(3);
    expect(stub).to.have.been.calledWith(4);
    expect(stub).to.have.been.calledWith(5);

    expect(stub).to.not.have.been.calledWith(6);
    expect(stub).to.not.have.been.calledWith(7);

    expect(stub).to.have.been.calledWith(8);
    expect(stub).to.have.been.calledWith(9);
  });


  // This test was used to create a LOT of data
  // It's skipped by default because it takes very long and the assertion isnt as useful as the previous tests
  // Use it for debugging :)
  xit('Smoke tests', async function () {
    this.timeout(60000);
    const stub = sandbox.stub();

    const fn = throttledFunction(stub, 5, 3);
    MockDate.set(new Date('2020-12-21T04:01:00'));
    for (let y = 1; y < 3; y++) {
      for (let x = 1; x < 30; x++) {
        for (let i = 1; i < 20; i++) {
          for (let j = 0; j < 50; j++) {

            const date = new Date();
            date.setMinutes(j);
            date.setHours(i);
            date.setMonth(y);
            date.setDate(x);
            MockDate.set(date);

            for (let n = 0; n < Math.random() * 50; n++) {
              fn(`${y}-${x}-${i}:${j} - ${n}`);
            }
          }
        }
      }
    }
  });

});
