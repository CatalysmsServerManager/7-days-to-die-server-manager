'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'customdiscordnotification',
      'message',
      {
        type: Sequelize.DataTypes.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'customdiscordnotification',
      'message'
    );
  }
};
