const fn = require('../../../worker/util/customFunctions/wait');
const helper = require('../../../worker/util/wait');

describe('CustomFunction wait', function () {
  const instance = new fn();
  let stub;
  beforeEach(() => {
    stub = sandbox.stub(helper, 'wait');
  });

  it('Calls the wait helper', async () => {
    instance.run();
    expect(stub).to.have.been.calledOnce;
  });

  it('Calls the wait helpers with the correct arguments', async () => {
    instance.run(5);
    expect(stub).to.have.been.calledOnceWith(5);
  });

  it('Parses strings to int', async () => {
    instance.run('5');
    expect(stub).to.have.been.calledOnceWith(5);
  });

});
