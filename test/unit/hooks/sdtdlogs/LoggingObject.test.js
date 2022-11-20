const LoggingObject = require('../../../../api/hooks/sdtdLogs/LoggingObject');

class TestLoggingObject extends LoggingObject {

  triggerMsg(date = '2020-06-30', time = '22:09:11', msg = 'test') {
    return this.handleMessage({
      type: 'logLine',
      data: {
        msg,
        date,
        time,
      }
    });
  }
}

describe('LoggingObject', () => {


  it('Can dedupe messages', async () => {
    const loggingObject = new TestLoggingObject({ ...sails.testServer, config: sails.testServerConfig });
    const emitSpy = sandbox.spy(loggingObject, 'emit');

    await loggingObject.triggerMsg();
    await loggingObject.triggerMsg();

    expect(emitSpy).to.have.been.calledOnce;

  });

  // It's a little nasty to test internal state, but it's the easiest way to test this
  it('Deletes old messages', async () => {
    const loggingObject = new TestLoggingObject({ ...sails.testServer, config: sails.testServerConfig });
    const emitSpy = sandbox.spy(loggingObject, 'emit');

    const now = new Date();
    const timeNow = now.toISOString().split('T')[1].split('.')[0];
    const dateNow = now.toISOString().split('T')[0];


    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    const timeTenMinutesAgo = tenMinutesAgo.toISOString().split('T')[1].split('.')[0];
    const dateTenMinutesAgo = tenMinutesAgo.toISOString().split('T')[0];

    for (let i = 0; i < 501; i++) {
      await loggingObject.triggerMsg(dateTenMinutesAgo, timeTenMinutesAgo, 'test ' + i);
    }

    await loggingObject.triggerMsg(dateNow, timeNow);

    expect(loggingObject.messageCache.size).to.be.equal(1);
  });

});
