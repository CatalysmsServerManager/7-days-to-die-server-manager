const fn = require('../../../worker/util/customFunctions/wait');
const helper = require('../../../worker/util/wait');

describe('CustomFunction wait', function () {
  let stub;
  let instance;
  beforeEach(() => {
    stub = sandbox.stub(helper, 'wait');
    instance = new fn(sails.testServer);
  });

  it('Calls the wait helper', async () => {
    instance.run();
    expect(stub).to.have.been.calledOnce;
  });

  it('Parses strings to int', async () => {
    instance.run('5');
    expect(stub).to.have.been.calledOnceWith(5);
  });
});
