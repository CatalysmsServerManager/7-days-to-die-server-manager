'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('trackinginfo', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_trackinginfo_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
    })

    await queryInterface.addConstraint('playerteleport', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_playerteleport_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('trackinginfo', 'FK_trackinginfo_player')
    await queryInterface.removeConstraint('playerteleport', 'FK_playerteleport_player')
  }
};
