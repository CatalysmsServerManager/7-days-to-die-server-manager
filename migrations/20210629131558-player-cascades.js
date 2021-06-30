'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.sequelize.query(`
    DELETE
    FROM playerteleport 
    WHERE player NOT IN (SELECT id FROM player)
`)

    await queryInterface.sequelize.query(`
    DELETE
    FROM trackinginfo 
    WHERE player NOT IN (SELECT id FROM player)
    OR server NOT IN (SELECT id FROM sdtdserver)
`)

    await queryInterface.addConstraint('trackinginfo', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_trackinginfo_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

    await queryInterface.addConstraint('trackinginfo', {
      fields: ['server'],
      type: 'FOREIGN KEY',
      name: 'FK_trackinginfo_server',
      references: {
        table: 'sdtdserver',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
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
      onUpdate: 'cascade',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('trackinginfo', 'FK_trackinginfo_player')
    await queryInterface.removeConstraint('playerteleport', 'FK_playerteleport_player')
  }
};
