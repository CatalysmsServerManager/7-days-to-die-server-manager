const expect = require('chai').expect;
const Command = require('../../../../api/hooks/discordBot/commands/sdtd/serverInfo');
const Channel = require('discord.js').TextChannel;
const customEmbed = require('../../../../api/hooks/discordBot/util/createEmbed').CustomEmbed;

describe('Discord - serverInfo', function () {
  let sendStub;
  beforeEach(() => {
    const serverInfoResponse = {
      ...sails.testServer,
      stats: {
        gametime: { days: 1, hours: 7, minutes: 0 },
        players: 0,
        hostiles: 0,
        animals: 0

      },
      serverInfo: {

        GameType: '7DTD',
        GameName: 'My Game',
        GameHost: 'CSMM Dev',
        ServerDescription: 'A 7 Days to Die server',
        ServerWebsiteURL: '',
        LevelName: 'Navezgane',
        GameMode: 'Survival',
        Version: 'Alpha.19.0.154',
        IP: '192.168.1.1',
        CountryCode: 'DE',
        SteamID: '90137051741492337',
        CompatibilityVersion: 'Alpha 19',
        Platform: 'LinuxPlayer',
        ServerLoginConfirmationText: '',
        Port: 26900,
        CurrentPlayers: 0,
        MaxPlayers: 8,
        GameDifficulty: 2,
        DayNightLength: 60,
        BloodMoonFrequency: 7,
        BloodMoonRange: 0,
        BloodMoonWarning: 8,
        ZombiesRun: -1,
        ZombieMove: 0,

        ZombieMoveNight: 3,
        ZombieFeralMove: 3,
        ZombieBMMove: 3,
        XPMultiplier: 100,
        DayCount: 3,
        Ping: -1,
        DropOnDeath: 1,
        DropOnQuit: 0,
        BloodMoonEnemyCount: 8,
        EnemyDifficulty: 0,
        PlayerKillingMode: 3,
        CurrentServerTime: 7000,
        DayLightLength: 18,
        BlockDurabilityModifier: -1,
        BlockDamagePlayer: 100,
        BlockDamageAI: 100,
        BlockDamageAIBM: 100,
        AirDropFrequency: 72,
        LootAbundance: 100,
        LootRespawnDays: 30,
        MaxSpawnedZombies: 64,
        LandClaimCount: 1,
        LandClaimSize: 41,
        LandClaimDeadZone: 30,
        LandClaimExpiryTime: 7,
        LandClaimDecayMode: 0,
        LandClaimOnlineDurabilityModifier: 4,
        LandClaimOfflineDurabilityModifier: 4,
        LandClaimOfflineDelay: 0,
        PartySharedKillRange: 100,
        MaxSpawnedAnimals: 50,
        ServerVisibility: 2,
        BedrollExpiryTime: 45,
        IsDedicated: true,
        IsPasswordProtected: true,
        ShowFriendPlayerOnMap: true,
        BuildCreate: false,
        EACEnabled: true,
        Architecture64: true,
        StockSettings: true,
        StockFiles: true,
        ModdedConfig: false,

        RequiresMod: false,
        AirDropMarker: false,
        EnemySpawnMode: true,
        IsPublic: true
      }
    };
    sandbox.stub(SdtdConfig, 'find').callsFake(() => ['some random shit']);
    sandbox.stub(SdtdServer, 'findOne').callsFake(() => sails.testServer);
    sendStub = sandbox.stub(Channel.prototype, 'send').callsFake(async () => null);
    sandbox.stub(sails.helpers, 'loadSdtdserverInfo').callsFake(async () => serverInfoResponse);
    Command.prototype.client = { customEmbed: customEmbed };
  });

  it('Sends a Discord message', async function () {

    await Command.prototype.run(
      {
        guild: { id: 'doesntmatter' },
        channel: new Channel({ client: { options: {} } }, {})
      },
      { server: 1 });

    expect(Channel.prototype.send).to.have.been.calledOnce;
    const sendCall = sendStub.getCall(0).firstArg;
    const settings = sendCall.fields.find(_ => _.name === 'Settings');
    const settingsContentArr = settings.value.split('\n').map(_ => _.trim()).filter(_ => _.length);
    expect(settingsContentArr.length).to.be.equal(settingsContentArr.filter(onlyUnique).length);
  });
});

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}




