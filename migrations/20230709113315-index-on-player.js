'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('player');
    const playerIndexes = await queryInterface.showIndex('player');

    if (!playerIndexes.some(idx => idx.name === 'IDX_player_steamId_server')) {
      await queryInterface.addIndex(
        'player',
        {
          name: 'IDX_player_steamId_server',
          unique: true,
          fields: ['steamId', 'server'],
        }
      );
    }

    if (!playerIndexes.some(idx => idx.name === 'IDX_player_server')) {
      await queryInterface.addIndex(
        'player',
        {
          name: 'IDX_player_server',
          fields: ['server'],
        }
      );
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'player',
      'IDX_player_steamId_server'
    );
    await queryInterface.removeIndex(
      'player',
      'IDX_player_server'
    );
  }
};
