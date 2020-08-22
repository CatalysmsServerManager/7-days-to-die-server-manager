const { handleRoleUpdate } = require('../../../../api/hooks/discordBot/roles/handleRoleUpdate');

const mockRoleChange = () => {

  const getMember = () => {
    return {
      user: {
        tag: 'testPlayer'
      },
      roles: {
        array: () => []
      },
      guild: {
        id: 'testDiscordGuild'
      }
    };
  };

  const oldMember = getMember();
  const newMember = getMember();

  newMember.roles.array = () => [{ name: 'addedRole', id: 'testDiscordRole' }];

  return [
    oldMember,
    newMember
  ];

};

describe('Discordbot#handleRoleUpdate', () => {
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
    const [oldRole, newRole] = mockRoleChange();
    expect(sails.testPlayer.role).to.eql(null);
    await handleRoleUpdate(oldRole, newRole);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(roles[1]);
  });

  it('Deletes a role from a CSMM user', async () => {
    const [newRole, oldRole] = mockRoleChange();
    expect(sails.testPlayer.role).to.eql(roles[1]);
    await handleRoleUpdate(oldRole, newRole);
    sails.testPlayer = await Player.findOne(sails.testPlayer.id).populate('role');
    expect(sails.testPlayer.role).to.eql(null);
  });


});
