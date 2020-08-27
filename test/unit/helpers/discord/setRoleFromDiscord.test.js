describe('setRoleFromDiscord', () => {

  let roles;
  before(async () => {
    await Role.create({
      name: 'test 1',
      level: 1,
      server: sails.testServer.id
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

    roles = await Role.find();
  });

  it('Adds a role to a CSMM user', async () => {
    sandbox.stub(sails.helpers.discord, 'discordrequest').resolves({
      roles: [
        'randomRole1',
        'randomRole2',
        'testDiscordRole',
        'randomRole3',
        'randomRole4'
      ],
    });
    expect(sails.testPlayer.role).to.eql(null);
    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
  });

  it('Does not give a new role if the player already has a higher role in CSMM', async () => {
    await Player.update(sails.testPlayer.id, { role: roles[0].id });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
    await sails.helpers.discord.setRoleFromDiscord(sails.testPlayer.id);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
  });
});
