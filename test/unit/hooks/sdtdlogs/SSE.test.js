const { expect } = require('chai');
const SdtdSSE = require('../../../../api/hooks/sdtdLogs/eventDetectors/7d2dSSE');
const { wait } = require('../../../../worker/util/wait');

describe('7d2dSSE', function () {

  it('Correctly parses chat messages with hccp enabled', async () => {
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });
    const stub = sandbox.stub(sse, 'handleMessage');

    // With hccp enabled
    sse.listener({ data: '{"msg":"Chat (from \'76561198028175941\', entity id \'171\', to \'Global\'): \'Catalysm\':@test","type":"Log","trace":"","date":"2021-07-27","time":"12:15:23","uptime":"6141.643"}' });
    sse.listener({ data: '{"msg":"Chat handled by mod \'CSMM Patrons\': Chat (from \'76561198028175941\', entity id \'171\', to \'Global\'): \'Catalysm\': @test","type":"Log","trace":"","date":"2021-07-27","time":"12:15:23","uptime":"6141.645"}' });

    await wait(1);
    expect(stub).to.have.been.calledTwice;
    expect(stub.firstCall.firstArg.type).to.be.equal('logLine');
    expect(stub.secondCall.firstArg.type).to.be.equal('chatMessage');
  });

  it('Correctly parses chat messages with hccp disabled', async () => {
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });
    const stub = sandbox.stub(sse, 'handleMessage');

    // With hccp disabled
    sse.listener({ data: '{"msg":"Chat (from \'-non-player-\', entity id \'-1\', to \'Global\'): \'[FF00FF]Catalysm[-]\': @test","type":"Log","trace":"","date":"2021-07-27","time":"12:24:30","uptime":"6688.447"}' });
    sse.listener({ data: '{"msg":"Chat handled by mod \'CSMM Patrons\': Chat (from \'76561198028175941\', entity id \'171\', to \'Global\'): \'Catalysm\': @test","type":"Log","trace":"","date":"2021-07-27","time":"12:24:30","uptime":"6688.448"}' });

    await wait(1);
    expect(stub).to.have.been.calledTwice;
    expect(stub.firstCall.firstArg.type).to.be.equal('logLine');
    expect(stub.secondCall.firstArg.type).to.be.equal('chatMessage');
  });

  it('correctly parses vanilla chat messages', async () => {
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });
    const stub = sandbox.stub(sse, 'handleMessage');

    sse.listener({ data: '{"msg":"Chat (from \'76561198028175941\', entity id \'171\', to \'Global\'): \'Catalysm\':@test","type":"Log","trace":"","date":"2021-07-27","time":"12:15:23","uptime":"6141.643"}' });

    await wait(1);
    expect(stub).to.have.been.calledOnce;
    expect(stub.firstCall.firstArg.type).to.be.equal('chatMessage');

  });

  it('Correctly parses chat messages from server', async () => {
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });
    const stub = sandbox.stub(sse, 'handleMessage');

    // With hccp enabled
    sse.listener({ data: `{"msg":"Chat (from '-non-player-', entity id '-1', to 'Global'): '[B43104]{Server-Auto}[-]': Nighttime in 2 hours !!!","type":"Log","trace":"","date":"2021-08-12","time":"16:45:01","uptime":"889.056"}` });
    sse.listener({ data: `{"msg":"Chat (from '-non-player-', entity id '-1', to 'Global'): '[B43104]{Server-Auto}[-]': Better hurry! Its bloodmoon TONIGHT !!!","type":"Log","trace":"","date":"2021-08-12","time":"16:45:01","uptime":"889.057"}` });

    await wait(1);
    expect(stub).to.have.been.calledTwice;
    expect(stub.firstCall.firstArg.type).to.be.equal('logLine');
    expect(stub.secondCall.firstArg.type).to.be.equal('logLine');
  });

});
