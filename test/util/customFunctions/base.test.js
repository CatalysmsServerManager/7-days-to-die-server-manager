const { expect } = require('chai');
const fn = require('../../../worker/util/customFunctions/base');

describe('CustomFunction base', function () {
  let stub;
  let instance;
  beforeEach(() => {
    instance = new fn('base');
    stub = sandbox.stub(instance, 'exec');
  });

  // Exec function is what child classes implement
  it('Calls the exec function', async () => {
    instance.run(sails.testServer);
    expect(stub).to.have.been.calledOnceWith(sails.testServer, []);
  });

  it('Parses strings to int', async () => {
    instance.run(sails.testServer, '5');
    expect(stub).to.have.been.calledOnceWith(sails.testServer, [5]);
  });

  it('Handles quotes properly', async () => {
    instance.run(sails.testServer, '"hello with", "some spaces"');
    expect(stub).to.have.been.calledOnceWith(sails.testServer, ['hello with', 'some spaces']);
  });

  it('Doesnt parse numbers larger than MAX_SAFE_INTEGER', async () => {
    const x = `${Number.MAX_SAFE_INTEGER + 100}`;
    instance.run(sails.testServer, x);
    expect(stub).to.have.been.calledOnceWith(sails.testServer, [x]);


  });

});
