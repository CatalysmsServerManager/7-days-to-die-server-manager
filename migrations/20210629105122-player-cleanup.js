'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'playerCleanupLastOnline',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'playerCleanupLastOnline'
    );
  }
};
