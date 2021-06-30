'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {



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

    await queryInterface.sequelize.query(`
    DELETE
    FROM playerteleport 
    WHERE player NOT IN (SELECT id FROM player)
`)

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


    await queryInterface.sequelize.query(`
    DELETE
    FROM countryban 
    WHERE player NOT IN (SELECT id FROM player)
    OR server NOT IN (SELECT id FROM sdtdserver)
`)

    await queryInterface.addConstraint('countryban', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_countryban_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

    await queryInterface.addConstraint('countryban', {
      fields: ['server'],
      type: 'FOREIGN KEY',
      name: 'FK_countryban_server',
      references: {
        table: 'sdtdserver',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })



    await queryInterface.sequelize.query(`
    DELETE
    FROM historicalinfo 
    WHERE player NOT IN (SELECT id FROM player)
    OR server NOT IN (SELECT id FROM sdtdserver)
`)

    await queryInterface.addConstraint('historicalinfo', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_historicalinfo_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

    await queryInterface.addConstraint('historicalinfo', {
      fields: ['server'],
      type: 'FOREIGN KEY',
      name: 'FK_historicalinfo_server',
      references: {
        table: 'sdtdserver',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })


    await queryInterface.sequelize.query(`
    DELETE
    FROM playerclaimitem 
    WHERE player NOT IN (SELECT id FROM player)
`)

    await queryInterface.addConstraint('playerclaimitem', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_playerclaimitem_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

    await queryInterface.sequelize.query(`
    DELETE
    FROM playerusedcommand 
    WHERE player NOT IN (SELECT id FROM player)
`)

    await queryInterface.addConstraint('playerusedcommand', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_playerusedcommand_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

    await queryInterface.sequelize.query(`
    DELETE
    FROM playerusedgimme 
    WHERE player NOT IN (SELECT id FROM player)
`)

    await queryInterface.addConstraint('playerusedgimme', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_playerusedgimme_player',
      references: {
        table: 'player',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })


    await queryInterface.sequelize.query(`
    DELETE
    FROM sdtdticket 
    WHERE player NOT IN (SELECT id FROM player)
`)

    await queryInterface.addConstraint('sdtdticket', {
      fields: ['player'],
      type: 'FOREIGN KEY',
      name: 'FK_sdtdticket_player',
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
    await queryInterface.removeConstraint('trackinginfo', 'FK_trackinginfo_server')

    await queryInterface.removeConstraint('playerteleport', 'FK_playerteleport_player')

    await queryInterface.removeConstraint('countryban', 'FK_countryban_player')
    await queryInterface.removeConstraint('countryban', 'FK_countryban_server')

    await queryInterface.removeConstraint('historicalinfo', 'FK_historicalinfo_player')
    await queryInterface.removeConstraint('historicalinfo', 'FK_historicalinfo_server')

    await queryInterface.removeConstraint('playerclaimitem', 'FK_playerclaimitem_player')

    await queryInterface.removeConstraint('playerusedgimme', 'FK_playerusedgimme_player')

    await queryInterface.removeConstraint('playerusedcommand', 'FK_playerusedcommand_player')

    await queryInterface.removeConstraint('sdtdticket', 'FK_sdtdticket_player')
  }
};
