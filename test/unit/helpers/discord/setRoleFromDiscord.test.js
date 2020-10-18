const { expect } = require('chai');

describe('setRoleFromDiscord', () => {

  it('fails a test', () => {
    expect(1).to.be.eql(2);
  });

  describe('shouldSetRole', () => {
    const shouldSetRole = require('../../../../api/helpers/discord/set-role-from-discord').shouldSetRole;
    it('Returns true if currentRole null and potentionRole not null', () => {
      expect(shouldSetRole(null, { level: 5 })).to.be.true;
    });
    it('Returns false if currentRole null and potentionRole null', () => {
      expect(shouldSetRole(null, null)).to.be.false;
    });
    it('Returns false if currentRole not null and potentionRole null', () => {
      expect(shouldSetRole({ level: 5 }, null)).to.be.false;
    });
    it('Returns false if currentRole level 5 and potentionRole level 10', () => {
      expect(shouldSetRole({ level: 5 }, { level: 10 })).to.be.false;
    });
    it('Returns true if currentRole level 10 and potentionRole level 5', () => {
      expect(shouldSetRole({ level: 10 }, { level: 5 })).to.be.true;
    });
    it('Returns false if currentRole level 5 and potentionRole level 5', () => {
      expect(shouldSetRole({ level: 5 }, { level: 5 })).to.be.false;
    });

    it('Returns false if currentRole level 5 and potentionRole invalid', () => {
      expect(shouldSetRole({ level: 5 }, 5)).to.be.false;
      expect(shouldSetRole({ level: 5 }, { asfsa: 'fasfas' })).to.be.false;
      expect(shouldSetRole({ level: 5 }, { level: 'fasfas' })).to.be.false;
      expect(shouldSetRole({ level: 5 }, { level: -Infinity })).to.be.false;
      expect(shouldSetRole({ level: 5 }, { level: NaN })).to.be.false;
    });
  });

  let roles;
  beforeEach(async () => {
    await Role.create({
      name: 'test 1',
      level: 1,
      server: sails.testServer.id,
      discordRole: 'testDiscordRole1'
    });

    await Role.create({
      name: 'test 10',
      level: 10,
      server: sails.testServer.id,
      discordRole: 'testDiscordRole'
    });

    await Role.create({
      name: 'test 100',
      level: 100,
      server: sails.testServer.id
    });

    roles = await Role.find({ name: { in: ['test 1', 'test 10', 'test 100'] } });
  });

  it('Adds a role to a CSMM user with no role', async () => {
    sandbox.stub(sails.helpers.discord, 'discordrequest').resolves({
      roles: [
        'randomRole1',
        'randomRole2',
        'testDiscordRole',
      ],
    });
    expect(sails.testPlayer.role).to.eql(null);
    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
  });

  it('Adds a role to a CSMM user with a role that has less permissions', async () => {
    sandbox.stub(sails.helpers.discord, 'discordrequest').resolves({
      roles: [
        'randomRole1',
        'randomRole2',
        'testDiscordRole1',
      ],
    });

    await Player.update({ id: sails.testPlayer.id }, { role: roles[1].id });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
  });

  it('Does not give a new role if the player already has a higher role in CSMM', async () => {
    await Player.update(sails.testPlayer.id, { role: roles[0].id });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
  });

  /**
   * When a victim server does not have the discord roles sync configured
   * The discord role check will return undefined
   * and a player authenticates via Discord on CSMM (and kicks off the role sync)
   * This resulted in the suspect getting admin rights (highest role) on the victim server
   */
  it('Does not give a new role to a player on a different server', async () => {
    sandbox.stub(sails.helpers.discord, 'discordrequest').resolves({
      roles: undefined,
    });
    await Player.update(sails.testPlayer.id, { role: null });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(null);


    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);


    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(null);
  });
});
