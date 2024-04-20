const { expect } = require('chai');
const sinon = require('sinon');
const Bull = require('bull');

const hook = require('../../../../worker/processors/playerTracking');

const trackingFunctions = require('../../../../worker/processors/playerTracking/trackingFunctions');


describe('Player tracking', () => {

  beforeEach(() => {
    sandbox.spy(trackingFunctions, 'location');
    sandbox.spy(trackingFunctions, 'inventory');
    sandbox.spy(trackingFunctions, 'basic');
    sandbox.spy(TrackingInfo, 'createEach');
    sandbox.stub(Bull.prototype, 'add');
    sandbox.stub(sails.helpers.sdtdApi, 'getPlayerInventories').returns([]);

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

    await hook({data: {serverId: sails.testServer.id}});

    expect(trackingFunctions.basic).to.have.been.calledOnce;
    expect(trackingFunctions.location).to.have.been.calledOnce;
    expect(trackingFunctions.inventory).to.have.been.calledOnce;

    // Adds bannedItems job to queue
    expect(Bull.prototype.add).to.have.been.calledOnce;
    // Creates tracking records
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

    await hook({data: {serverId: sails.testServer.id}});

    expect(trackingFunctions.basic).to.not.have.been.calledOnce;
    expect(trackingFunctions.location).to.not.have.been.calledOnce;
    expect(trackingFunctions.inventory).to.not.have.been.calledOnce;

    expect(Bull.prototype.add).not.to.have.been.calledOnce;

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

      await hook({data: {serverId: sails.testServer.id}});
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
      await hook({data: {serverId: sails.testServer.id}});

      expect(Bull.prototype.add).to.have.been.calledOnceWith(sinon.match.has('zombieKills', 4));
      expect(Bull.prototype.add).to.have.been.calledOnceWith(sinon.match.has('zombiesKilled', 1));

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
      await hook({data: {serverId: sails.testServer.id}});

      expect(Bull.prototype.add).to.have.been.calledOnceWith(sinon.match.has('playerKills', 4));
      expect(Bull.prototype.add).to.have.been.calledOnceWith(sinon.match.has('playersKilled', 1));
    });

    // Next two tests are disabled because it's disabled in code atm

    xit('Detects player leveled up', async () => {
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
      await hook({data: {serverId: sails.testServer.id}});

      expect(Bull.prototype.add).to.have.been.calledOnceWith('levelup', sinon.match.any);
    });

    xit('Detects player score gain', async () => {
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
      await hook({data: {serverId: sails.testServer.id}});

      expect(Bull.prototype.add).to.have.been.calledOnceWith('score', sinon.match.any);
    });

  });
});
