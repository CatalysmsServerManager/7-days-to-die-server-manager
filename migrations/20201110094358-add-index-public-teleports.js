'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addIndex(
      'playerteleport',
      {
        name: 'IDX_playerteleport_public',
        unique: false,
        fields: ['public']
      }
    );

    await queryInterface.addIndex(
      'playerteleport',
      {
        name: 'IDX_playerteleport_player',
        unique: false,
        fields: ['player']
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex(
      'playerteleport',
      'IDX_playerteleport_public'
    );

    await queryInterface.removeIndex(
      'playerteleport',
      'IDX_playerteleport_player'
    );
  }
};
