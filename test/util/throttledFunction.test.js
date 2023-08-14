const ThrottledFunction = require('../../worker/util/throttledFunction');
const MockDate = require('mockdate');
const { expect } = require('chai');
const { wait } = require('../../worker/util/wait');

xdescribe('throttledFunction', function () {
  it('Throttles a function and emits events', async () => {
    const stub = sandbox.stub();
    const throttledEventStub = sandbox.stub();
    const normalEventStub = sandbox.stub();

    const throttledFunction = new ThrottledFunction(stub, 5, 3);

    throttledFunction.on('throttled', throttledEventStub);
    throttledFunction.on('normal', normalEventStub);

    MockDate.set(new Date('2020-12-21T03:24:00'));
    throttledFunction.listener(1);
    throttledFunction.listener(2);
    throttledFunction.listener(3);
    throttledFunction.listener(4);
    MockDate.set(new Date('2020-12-21T03:25:00'));
    throttledFunction.listener(5);
    expect(throttledEventStub).to.not.have.been.calledOnce;

    // These get blocked
    throttledFunction.listener(6);
    throttledFunction.listener(7);

    expect(throttledEventStub).to.have.been.calledOnce;
    expect(normalEventStub).to.not.have.been.calledOnce;


    // These arent blocked anymore
    MockDate.set(new Date('2020-12-21T03:29:00'));
    throttledFunction.listener(8);
    throttledFunction.listener(9);

    expect(stub).to.have.callCount(7);
    expect(stub).to.have.been.calledWith(1);

    expect(normalEventStub).to.have.been.calledOnce;

  });

  it('Works accross hours', async () => {
    const stub = sandbox.stub();

    const throttledFunction = new ThrottledFunction(stub, 5, 3);

    MockDate.set(new Date('2020-12-21T03:56:00'));
    throttledFunction.listener(1);
    MockDate.set(new Date('2020-12-21T03:57:00'));
    throttledFunction.listener(2);
    throttledFunction.listener(3);
    throttledFunction.listener(4);
    MockDate.set(new Date('2020-12-21T03:58:00'));
    throttledFunction.listener(5);
    MockDate.set(new Date('2020-12-21T03:59:00'));
    throttledFunction.listener(6);

    throttledFunction.listener(7);

    // These arent blocked anymore
    MockDate.set(new Date('2020-12-21T04:01:00'));
    throttledFunction.listener(8);
    throttledFunction.listener(9);

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

  it('Returns to normal after a while, even when the function does not get triggered', async () => {
    const stub = sandbox.stub();

    const throttledFunction = new ThrottledFunction(stub, 5, 0.1);

    const throttledListener = sandbox.stub();
    const normalListener = sandbox.stub();

    throttledFunction.on('throttled', throttledListener);
    throttledFunction.on('normal', normalListener);

    MockDate.set(new Date('2020-12-21T03:56:00'));
    throttledFunction.listener();
    throttledFunction.listener();
    throttledFunction.listener();
    throttledFunction.listener();
    throttledFunction.listener();
    throttledFunction.listener();

    expect(throttledListener).to.have.been.calledOnce;
    expect(normalListener).to.not.have.been.calledOnce;

    // wait a while
    MockDate.set(new Date('2020-12-21T04:06:00'));
    await wait(8);

    expect(normalListener).to.have.been.calledOnce;
    expect(throttledListener).to.have.been.calledOnce;

  });

  // This test was used to create a LOT of data
  // It's skipped by default because it takes very long and the assertion isnt as useful as the previous tests
  // Use it for debugging :)
  xit('Smoke tests', async function () {
    this.timeout(60000);
    const stub = sandbox.stub();

    const fn = ThrottledFunction(stub, 5, 3);
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
