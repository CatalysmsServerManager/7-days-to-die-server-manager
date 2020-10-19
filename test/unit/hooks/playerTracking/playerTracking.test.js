const { expect } = require('chai');

let hook;
let loggingObject;

describe('Player tracking', () => {

  before(() => {
    hook = sails.hooks.playertracking;
  });

  beforeEach(() => {
    loggingObject = {
      emit: sandbox.spy(),
    };

    sandbox.spy(hook, 'locationTracking');
    sandbox.spy(hook, 'inventoryTracking');
    sandbox.spy(hook, 'basicTracking');
    sandbox.spy(hook, 'deleteLocationData');
    sandbox.spy(sails.hooks.banneditems, 'run');
    sandbox.spy(TrackingInfo, 'createEach');
  });

  it('Should call the different tracking functions', async () => {
    sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers').returns(['player1', 'player2']);
    sandbox.stub(SdtdServer, 'findOne').returns({
      populate: () => {
        return {
          ...sails.testServer,
          config: [{
            ...sails.testServer.config,
            locationTracking: true,
            inventoryTracking: true
          }]
        };
      }
    });

    await hook.intervalFunc(sails.testServer.id, loggingObject);

    expect(hook.basicTracking).to.have.been.calledOnce;
    expect(hook.locationTracking).to.have.been.calledOnce;
    expect(hook.inventoryTracking).to.have.been.calledOnce;

    expect(sails.hooks.banneditems.run).to.have.been.calledOnce;
    expect(TrackingInfo.createEach).to.have.been.calledOnce;
  });

  it('Does nothing when there are no players online', async () => {
    sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers').returns([]);
    sandbox.stub(SdtdServer, 'findOne').returns({
      populate: () => {
        return {
          ...sails.testServer,
          config: [{
            ...sails.testServer.config,
            locationTracking: true,
            inventoryTracking: true
          }]
        };
      }
    });

    await hook.intervalFunc(sails.testServer.id, loggingObject);

    expect(hook.basicTracking).to.not.have.been.calledOnce;
    expect(hook.locationTracking).to.not.have.been.calledOnce;
    expect(hook.inventoryTracking).to.not.have.been.calledOnce;

    expect(loggingObject.emit).to.not.have.been.calledOnceWith('trackingUpdate');

  });

  it('Deletes data after a certain time period', async () => {
    sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers').returns(['player1', 'player2']);
    sandbox.stub(SdtdServer, 'findOne').returns({
      populate: () => {
        return {
          ...sails.testServer,
          config: [{
            ...sails.testServer.config,
            locationTracking: true,
            inventoryTracking: true
          }]
        };
      }
    });

    sandbox.stub(sails.helpers.sdtdApi, 'getPlayerInventories').returns([]);
    sandbox.stub(sails.helpers.redis, 'get').returns(sails.config.custom.trackingCyclesBeforeDelete + 1);
    sandbox.stub(sails, 'sendNativeQuery').returns({ affectedRows: 1337 });

    // Kinda scuffed, we overwrite the redis getter earlier so this overwrite is weird ^^
    sails.config.custom.donorConfig[sails.config.custom.trackingCyclesBeforeDelete + 1] = {};
    sails.config.custom.donorConfig[sails.config.custom.trackingCyclesBeforeDelete + 1].playerTrackerKeepLocationHours = 8;

    await hook.intervalFunc(sails.testServer.id, loggingObject);

    expect(hook.deleteLocationData).to.have.been.calledOnce;
    expect(sails.sendNativeQuery).to.have.been.calledOnce;
  });

  describe('basicTracking', () => {

    it('Updates player records', async () => {
      sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers').returns([{ ...sails.testPlayer, steamid: sails.testPlayer.steamId }]);
      sandbox.stub(SdtdServer, 'findOne').returns({
        populate: () => {
          return {
            ...sails.testServer,
            config: [{
              ...sails.testServer.config,
              locationTracking: false,
              inventoryTracking: false
            }]
          };
        }
      });

      sandbox.spy(Player, 'update');

      await hook.intervalFunc(sails.testServer.id, loggingObject);
      expect(Player.update).to.have.been.calledOnceWith(sails.testPlayer.id);
    });

    it('Detects zombie kills', async () => {
      sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers')
        .returns([
          {
            steamid: sails.testPlayer.steamId,
            zombiekills: 5,
            level: 5
          }]);
      sandbox.stub(SdtdServer, 'findOne').returns({
        populate: () => {
          return {
            ...sails.testServer,
            config: [{
              ...sails.testServer.config,
              locationTracking: false,
              inventoryTracking: false
            }]
          };
        }
      });

      await Player.update(sails.testPlayer.id, { zombieKills: 4 });
      await hook.intervalFunc(sails.testServer.id, loggingObject);

      expect(loggingObject.emit).to.have.been.calledOnceWith('zombieKill');

    });

    it('Detects player kills', async () => {
      sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers')
        .returns([
          {
            steamid: sails.testPlayer.steamId,
            playerkills: 5,
            level: 5
          }]);
      sandbox.stub(SdtdServer, 'findOne').returns({
        populate: () => {
          return {
            ...sails.testServer,
            config: [{
              ...sails.testServer.config,
              locationTracking: false,
              inventoryTracking: false
            }]
          };
        }
      });

      await Player.update(sails.testPlayer.id, { playerKills: 4 });
      await hook.intervalFunc(sails.testServer.id, loggingObject);

      expect(loggingObject.emit).to.have.been.calledOnceWith('playerKill');
    });

    it('Detects player leveled up', async () => {
      sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers')
        .returns([
          {
            steamid: sails.testPlayer.steamId,
            level: 5
          }]);
      sandbox.stub(SdtdServer, 'findOne').returns({
        populate: () => {
          return {
            ...sails.testServer,
            config: [{
              ...sails.testServer.config,
              locationTracking: false,
              inventoryTracking: false
            }]
          };
        }
      });

      await Player.update(sails.testPlayer.id, { level: 4 });
      await hook.intervalFunc(sails.testServer.id, loggingObject);

      expect(loggingObject.emit).to.have.been.calledOnceWith('levelup');
    });

    it('Detects player score gain', async () => {
      sandbox.stub(sails.helpers.sdtd, 'getOnlinePlayers')
        .returns([
          {
            steamid: sails.testPlayer.steamId,
            level: 5,
            score: 5
          }]);
      sandbox.stub(SdtdServer, 'findOne').returns({
        populate: () => {
          return {
            ...sails.testServer,
            config: [{
              ...sails.testServer.config,
              locationTracking: false,
              inventoryTracking: false
            }]
          };
        }
      });

      await Player.update(sails.testPlayer.id, { score: 4 });
      await hook.intervalFunc(sails.testServer.id, loggingObject);

      expect(loggingObject.emit).to.have.been.calledOnceWith('score');
    });

  });
});
