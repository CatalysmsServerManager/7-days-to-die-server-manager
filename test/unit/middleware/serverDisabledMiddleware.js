const serverDisabledMiddleware = require('../../../api/middleware/serverDisabledMiddleware');

describe('serverDisabledMiddleware', () => {
  it('should return 403 if server is disabled', async () => {
    await SdtdServer.update(sails.testServer.id, { disabled: true });

    const req = {
      param: sandbox.stub().returns(sails.testServer.id),
    };

    const nextSpy = sandbox.spy();
    const res = {
      send: sandbox.spy(),
      end: sandbox.stub(),
    };

    await serverDisabledMiddleware(req, res, nextSpy);

    expect(res.send).to.have.been.calledWith(403, 'This server is disabled');
    expect(nextSpy).to.not.have.been.called;
  });

  it('should call next if server is not disabled', async () => {
    await SdtdServer.update(sails.testServer.id, { disabled: false });

    const req = {
      param: sandbox.stub().returns(sails.testServer.id),
    };

    const nextSpy = sandbox.spy();
    const res = {
      send: sandbox.spy(),
      end: sandbox.stub(),
    };

    await serverDisabledMiddleware(req, res, nextSpy);

    expect(res.send).to.not.have.been.called;
    expect(nextSpy).to.have.been.called;
  });

  it('Should block calls when server id in query param', async () => {
    await SdtdServer.update(sails.testServer.id, { disabled: true });

    const req = {
      param: sandbox.stub().returns(null),
      query: {
        serverId: sails.testServer.id
      }
    };

    const nextSpy = sandbox.spy();
    const res = {
      send: sandbox.spy(),
      end: sandbox.stub(),
    };

    await serverDisabledMiddleware(req, res, nextSpy);

    expect(res.send).to.have.been.calledWith(403, 'This server is disabled');
    expect(nextSpy).to.not.have.been.called;
  });

  it('Should block calls when server id in param and query param', async () => {
    await SdtdServer.update(sails.testServer.id, { disabled: true });

    const req = {
      param: sandbox.stub().returns(sails.testServer.id),
      query: {
        serverId: sails.testServer.id
      }
    };

    const nextSpy = sandbox.spy();
    const res = {
      send: sandbox.spy(),
      end: sandbox.stub(),
    };

    await serverDisabledMiddleware(req, res, nextSpy);

    expect(res.send).to.have.been.calledWith(403, 'This server is disabled');
    expect(nextSpy).to.not.have.been.called;
  });

  it('Should call next when no server params are provided', async () => {
    const req = {
      param: sandbox.stub().returns(undefined),
      query: {
        serverId: undefined
      }
    };

    const nextSpy = sandbox.spy();
    const res = {
      send: sandbox.spy(),
      end: sandbox.stub(),
    };

    await serverDisabledMiddleware(req, res, nextSpy);

    expect(res.send).to.not.have.been.called;
    expect(nextSpy).to.have.been.called;
  });
});
