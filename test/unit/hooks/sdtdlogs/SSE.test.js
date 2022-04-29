const { expect } = require('chai');
const SdtdSSE = require('../../../../api/hooks/sdtdLogs/eventDetectors/7d2dSSE');
const { wait } = require('../../../../worker/util/wait');
const MockDate = require('mockdate');
const EventSource = require('eventsource');
const sinon = require('sinon');


describe('7d2dSSE', function () {
  let clock;

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

  it('Stops listening when server is throttled for extended period of time and reconnects after', async () => {
    clock = sinon.useFakeTimers();
    process.env.SSE_THROTTLE_DELAY = 1000 * 60 * 10;
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });

    await sse.start();

    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active at the start of the test');

    sse.throttledFunction.emit('throttled');


    await clock.tickAsync(sse.THROTTLE_DELAY / 2);
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should still be active when throttle delay is not exceeded');

    await clock.tickAsync(sse.THROTTLE_DELAY);
    expect(sse.eventSource).to.be.eql(null, 'EventSource should be destroyed after being throttled for $SSE_THROTTLE_DELAY');

    await clock.tickAsync(sse.THROTTLE_DELAY * 10);
    expect(sse.eventSource).to.be.eql(null, 'EventSource should be destroyed after being throttled for a long time');

    sse.throttledFunction.emit('normal');
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active after server is back to normal');
    clock.restore();
  });

  it('Attempts to reconnect SSE when no messages have been received for a long time', async () => {
    clock = sinon.useFakeTimers();
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });

    const reconnectSpy = sandbox.spy(sse, 'reconnectListener');

    await clock.tickAsync(sse.SSE_RECONNECT_INTERVAL - 1);
    expect(reconnectSpy).to.not.have.been.calledOnce;
    await clock.tickAsync(1);

    expect(reconnectSpy).to.have.been.calledOnce;

    clock.restore();
  });

  it('Sends a keepalive message when we are close to reaching the lastMessageThreshold', async () => {
    clock = sinon.useFakeTimers({ shouldClearNativeTimers: true, now: Date.now() });
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });

    const reconnectSpy = sandbox.spy(sse, 'reconnectListener');
    const keepaliveSpy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves();
    const destroySpy = sandbox.spy(sse, 'destroy');
    const startSpy = sandbox.spy(sse, 'start');

    await sse.start();
    await clock.tickAsync(sse.SSE_RECONNECT_INTERVAL);
    expect(reconnectSpy).to.have.been.calledOnce;
    expect(keepaliveSpy).not.to.have.been.called;
    await clock.tickAsync(sse.SSE_RECONNECT_INTERVAL);
    expect(reconnectSpy).to.have.been.calledTwice;
    expect(keepaliveSpy).to.have.been.calledOnceWith(sinon.match.any, 'version');
    expect(destroySpy).not.to.have.been.called;
    expect(startSpy).to.have.been.calledOnce;


    // Not calling the see listener on purpose so that 'no messages are received'

    await clock.tickAsync(sse.SSE_RECONNECT_INTERVAL);
    expect(reconnectSpy).to.have.been.calledThrice;

    // It should have recreated the listener
    expect(destroySpy).to.have.been.calledOnce;
    expect(startSpy).to.have.been.calledTwice;
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active after reconnection');

    clock.restore();
  });

  it('Should cancel destruction by throttling if server goes back to normal quickly enough', async () => {
    clock = sinon.useFakeTimers();
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });

    await sse.start();

    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active at the start of the test');

    sse.throttledFunction.emit('throttled');

    await clock.tickAsync(sse.THROTTLE_DELAY / 2);
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should still be active when throttle delay is not exceeded');

    sse.throttledFunction.emit('normal');
    await clock.tickAsync(sse.THROTTLE_DELAY);
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active after server is back to normal');
    clock.restore();
  });

  it('Should attempt a reconnect after a while, even when the function does not emit normal state', async () => {
    clock = sinon.useFakeTimers();
    process.env.SSE_THROTTLE_DELAY = 10;
    process.env.SSE_THROTTLE_RECONNECT_DELAY = 30;
    const sse = new SdtdSSE({ ...sails.testServer, config: sails.testServerConfig });

    await sse.start();

    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active at the start of the test');

    sse.throttledFunction.emit('throttled');

    await clock.tickAsync(sse.THROTTLE_DELAY);
    expect(sse.eventSource).to.be.eql(null, 'EventSource should be destroyed after being throttled');

    await clock.tickAsync(parseInt(process.env.SSE_THROTTLE_RECONNECT_DELAY, 10));
    expect(sse.eventSource).to.be.instanceOf(EventSource, 'EventSource should be active');


    clock.restore();
  });

});
