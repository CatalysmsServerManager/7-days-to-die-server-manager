'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
    DELETE
    FROM playerusedcommand 
    WHERE command NOT IN (SELECT id FROM customcommand)
`)

    await queryInterface.addConstraint('playerusedcommand', {
      fields: ['command'],
      type: 'FOREIGN KEY',
      name: 'FK_playerusedcommand_command',
      references: {
        table: 'customcommand',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('playerusedcommand', 'FK_playerusedcommand_command')
  }
};
