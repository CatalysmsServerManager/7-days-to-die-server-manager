const fn = require('../../../worker/util/customFunctions/base');

describe('CustomFunction base', function () {
  let stub;
  let instance;
  beforeEach(() => {
    instance = new fn(sails.testServer);
    stub = sandbox.stub(instance, 'exec');
  });

  // Exec function is what child classes implement
  it('Calls the exec function', async () => {
    instance.run();
    expect(stub).to.have.been.calledOnceWith([]);
  });

  it('Parses strings to int', async () => {
    instance.run('5');
    expect(stub).to.have.been.calledOnceWith([5]);
  });

});
