const { handleRoleUpdate } = require('../../../../api/hooks/discordBot/roles/handleRoleUpdate');

const mockRoleChange = () => {

  const getMember = () => {
    return {
      id: sails.testUser.discordId,
      user: {
        tag: 'testPlayer'
      },
      roles: {
        cache: {
          values: () => []
        }
      },
      guild: {
        id: 'testDiscordGuild'
      }
    };
  };

  const oldMember = getMember();
  const newMember = getMember();

  newMember.roles.cache.values = () => [{ name: 'addedRole', id: 'testDiscordRole' }];

  return [
    oldMember,
    newMember
  ];

};

describe('Discordbot#handleRoleUpdate', () => {
  let roles;
  beforeEach(async () => {
    await Player.update(sails.testPlayer.id, { role: null });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
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

    roles = await Role.find({ name: { in: ['test 1', 'test 10', 'test 100'] } });
  });

  it('Adds a role to a CSMM user', async () => {
    const [oldRole, newRole] = mockRoleChange();
    expect(sails.testPlayer.role).to.eql(null);
    await handleRoleUpdate(oldRole, newRole);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
  });

  it('Deletes a role from a CSMM user', async () => {
    const [newRole, oldRole] = mockRoleChange();
    await Player.update(sails.testPlayer.id, { role: roles[1].id });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
    await handleRoleUpdate(oldRole, newRole);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(null);
  });

  it('Does not give a new role if the player already has a higher role in CSMM', async () => {
    const [oldRole, newRole] = mockRoleChange();
    await Player.update(sails.testPlayer.id, { role: roles[0].id });
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
    await handleRoleUpdate(oldRole, newRole);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[0]);
  });

  it('Handles players that are part of multiple servers', async () => {

    const newServer = await SdtdServer.create({
      name: 'testServer 2',
      ip: '192.168.1.1',
      port: '1337',
      authName: 'blabla',
      authToken: 'bla',
      owner: sails.testUser.id
    }).fetch();
    await SdtdConfig.create({
      server: newServer.id,
      discordGuildId: 'testDiscordGuild'
    });
    let newPlayer = await Player.create({
      steamId: sails.testPlayer.steamId,
      user: sails.testUser.id,
      name: 'test player 2',
      server: newServer.id
    }).fetch();

    await Role.create({
      name: 'test 1',
      level: 1,
      server: newServer.id
    });

    const expectedRole = await Role.create({
      name: 'test 10 2',
      level: 10,
      server: newServer.id,
      discordRole: 'testDiscordRole'
    }).fetch();

    await Role.create({
      name: 'test 100',
      level: 100,
      server: newServer.id
    });

    await Player.update(sails.testPlayer.id, { role: null });


    const [oldRole, newRole] = mockRoleChange();
    expect(newPlayer.role).to.eql(null);
    await handleRoleUpdate(oldRole, newRole);
    newPlayer = await Player.findOne(newPlayer.id).populate('role');
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
    expect(newPlayer.role).to.eql(expectedRole);

  });

  it('handles correctly when a server has no role configured for discord role', async () => {
    const newServer = await SdtdServer.create({
      name: 'testServer 2',
      ip: '192.168.1.1',
      port: '1337',
      authName: 'blabla',
      authToken: 'bla',
      owner: sails.testUser.id
    }).fetch();
    await SdtdConfig.create({
      server: newServer.id,
      discordGuildId: 'testDiscordGuild'
    });
    let newPlayer = await Player.create({
      steamId: sails.testPlayer.steamId,
      user: sails.testUser.id,
      name: 'test player 2',
      server: newServer.id
    }).fetch();

    await Role.update({ where: { name: 'test 10' } }, { discordRole: null });
    const expectedRole = await Role.create({
      name: 'test 10 2',
      level: 10,
      server: newServer.id,
      discordRole: 'testDiscordRole'
    }).fetch();


    const [oldRole, newRole] = mockRoleChange();
    await handleRoleUpdate(oldRole, newRole);
    newPlayer = await Player.findOne({ where: { name: 'test player 2' } }).populate('role');
    expect(newPlayer.role).to.eql(expectedRole);
  });


});
