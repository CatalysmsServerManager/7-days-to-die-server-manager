const expect = require('chai').expect;
const Command = require('../../../../api/hooks/discordBot/commands/sdtd/status');
const Channel = require('discord.js').TextChannel;
const customEmbed = require('../../../../api/hooks/discordBot/util/createEmbed').CustomEmbed;

describe('Discord - status', function () {
  let sendStub;
  let serverInfoResponse;
  beforeEach(() => {
    serverInfoResponse = {
      stats: {
        gametime: { days: 5, hours: 15, minutes: 33},
        players: 13,
        hostiles: 5,
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
    const playerInfoResponse = [
      {name: 'Player a'}, {name: 'Player b'}
    ];
    sandbox.stub(SdtdConfig, 'find').callsFake(() => ['random server']);
    sandbox.stub(SdtdServer, 'findOne').callsFake(() => sails.testServer);
    sendStub = sandbox.stub(Channel.prototype, 'send').callsFake(() => null);
    sandbox.stub(sails.helpers, 'loadSdtdserverInfo').callsFake(async () => serverInfoResponse);
    sandbox.stub(sails.helpers.sdtd, 'loadFps').callsFake(async () => 15);
    sandbox.stub(sails.helpers.sdtd, 'loadPlayerData').value({ with: async () => playerInfoResponse });
    Command.prototype.client = {customEmbed: customEmbed};
  });

  it('Sends a discord message', async function () {

    await Command.prototype.run(
      {
        guild: { id: 'someGuildId'},
        channel: new Channel({}, {})
      },
      { server: 1});

    expect(Channel.prototype.send).to.have.been.calledOnce;
    const sendCall = sendStub.getCall(0).firstArg;
    const playersOnlineField = sendCall.fields.find(_ => _.name.includes('players online'));
    const playersOnline = parseInt(playersOnlineField.name.split(' ')[0]);
    expect(playersOnline).to.be.equal(serverInfoResponse.stats.players);
  });
});
