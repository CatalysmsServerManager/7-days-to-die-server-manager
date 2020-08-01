const {HighPingCount} = require('../../../../api/hooks/highPingKick/index.js');
const { expect } = require('chai');

describe('highPingCount', function () {
  it('Doesnt do anything when steamid is not found', async () => {
    sandbox.stub(sails.helpers.sdtdApi, 'getOnlinePlayers').returns(Promise.resolve(
      [
        {'steamid':'123456','entityid':97356,'ip':'1.1.1.1','name':'Fake Name','online':true,'position':{'x':81,'y':67,'z':-1030},'experience':-1,'level':3.63118052482605,'health':72,'stamina':79.4040069580078,'zombiekills':7,'playerkills':0,'playerdeaths':1,'score':7,'totalplaytime':0,'lastonline':'0001-01-01T00:00:00','ping':524}
      ]
    ));
    sails.testServerConfig.pingKickEnabled = 1;
    sandbox.stub(SdtdConfig, 'findOne').returns(Promise.resolve(sails.testServerConfig));

    const highPingCount = new HighPingCount({ });

    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
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

    const highPingCount = new HighPingCount({ });

    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
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

    const highPingCount = new HighPingCount({ });

    // first time
    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
    // second time
    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
    // third time
    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
    // has not yet been kicked
    expect(execSpy).to.have.callCount(0);
    // 4th time it should get kicked
    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
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

    const highPingCount = new HighPingCount({ });

    await highPingCount.handlePingCheck({
      server: sails.testServer
    });
    expect(execSpy).to.have.callCount(1);
  });
});

