const highPingCountHook = require('../../../../api/hooks/highPingKick/index.js');
const { expect } = require('chai');
const  EventEmitter = require('events').EventEmitter;


function MockLoggingObject() {
  return new EventEmitter();
}

function callEventEmitter(mockingObject, eventName, ...args) {
  return Promise.all(mockingObject.listeners(eventName).map(f => f(...args)));
}

describe('highPingCount', function () {
  let mockingObject;
  beforeEach(function () {
    mockingObject = new MockLoggingObject();
    mockingObject.spyOn = sandbox.spy(mockingObject, 'on');
    mockingObject.spyEmit = sandbox.spy(mockingObject, 'emit');
    mockingObject.spyRemoveListener = sandbox.spy(mockingObject, 'removeListener');
    sandbox.stub(sails.hooks.sdtdlogs, 'getLoggingObject').returns(mockingObject);
  });

  describe('start', function() {
    it('start non existant server', async function() {
      sandbox.stub(SdtdServer, 'findOne').returns(Promise.resolve(null));
      await expect(highPingCountHook(sails).start(sails.testServer.id)).to.be.rejectedWith(Error);
      expect(mockingObject.spyOn).not.to.have.been.called;
    });
    it('start server', async function() {
      sandbox.stub(SdtdServer, 'findOne').returns(Promise.resolve(sails.testServer));
      await highPingCountHook(sails).start(sails.testServer.id);
      expect(mockingObject.spyOn).to.have.been.calledWith('memUpdate', sandbox.match.func);
    });
  });

  describe('stop', function() {
    it('stop server', async function() {
      await highPingCountHook(sails).stop(sails.testServer.id);
      expect(mockingObject.spyRemoveListener).to.have.been.calledWith('memUpdate', sandbox.match.func);
    });
  });

  it('Doesnt do anything when steamid is not found', async () => {
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').returns(Promise.resolve(
      [
        {'steamid':'123456','entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524}
      ]
    ));
    sails.testServerConfig.pingKickEnabled = 1;
    sandbox.stub(SdtdConfig, 'findOne').returns(Promise.resolve(sails.testServerConfig));
    sandbox.stub(SdtdServer, 'findOne').returns(Promise.resolve(sails.testServer));

    await highPingCountHook(sails).start(sails.testServer.id);
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
  });
  it('Ignores user in whitelist', async () => {
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').returns(Promise.resolve(
      [
        {'steamid':sails.testPlayer.steamId,'entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524}
      ]
    ));
    const execSpy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve());

    sails.testServerConfig.pingKickEnabled = 1;
    sails.testServerConfig.pingWhitelist = JSON.stringify([ sails.testPlayer.steamId ]);

    sandbox.stub(SdtdConfig, 'findOne').returns(Promise.resolve(sails.testServerConfig));

    await highPingCountHook(sails).start(sails.testServer.id);
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });

    expect(execSpy).to.have.callCount(0);
  });
  it('kicks a player who has too high of ping for too long', async () => {
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').returns(Promise.resolve(
      [
        {'steamid':sails.testPlayer.steamId,'entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524}
      ]
    ));
    const execSpy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve());

    sails.testServerConfig.pingKickEnabled = 1;
    sails.testServerConfig.pingChecksToFail = 3;
    sails.testServerConfig.pingWhitelist = JSON.stringify([ ]);

    sandbox.stub(SdtdConfig, 'findOne').returns(Promise.resolve(sails.testServerConfig));

    await highPingCountHook(sails).start(sails.testServer.id);

    // first time
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
    // second time
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
    // third time
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
    // has not yet been kicked
    expect(execSpy).to.have.callCount(0);
    // 4th time it should get kicked
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
    expect(execSpy).to.have.callCount(1);
  });
  it('multiple accounts shouldnt break if the first one isnt found', async () => {
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').returns(Promise.resolve(
      [
        {'steamid':'123456','entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524},
        {'steamid':sails.testPlayer.steamId,'entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524}
      ]
    ));
    const execSpy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').returns(Promise.resolve());

    sails.testServerConfig.pingKickEnabled = 1;
    sails.testServerConfig.pingChecksToFail = 0;
    sails.testServerConfig.pingWhitelist = JSON.stringify([ ]);

    sandbox.stub(SdtdConfig, 'findOne').returns(Promise.resolve(sails.testServerConfig));

    await highPingCountHook(sails).start(sails.testServer.id);
    await callEventEmitter(mockingObject, 'memUpdate', { server: sails.testServer });
    expect(execSpy).to.have.callCount(1);
  });
});

