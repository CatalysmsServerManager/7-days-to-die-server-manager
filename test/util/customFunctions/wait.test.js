const fn = require('../../../worker/util/customFunctions/wait');
const helper = require('../../../worker/util/wait');

describe('CustomFunction wait', function () {
  let stub;
  let instance;
  beforeEach(() => {
    stub = sandbox.stub(helper, 'wait');
    instance = new fn();
  });

  it('Calls the wait helper', async () => {
    instance.run(sails.testServer);
    expect(stub).to.have.been.calledOnce;
  });

  it('Parses strings to int', async () => {
    instance.run(sails.testServer, '5');
    expect(stub).to.have.been.calledOnceWith(5);
  });

});
