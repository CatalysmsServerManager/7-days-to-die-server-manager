'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'mapProxy'
    );
    await queryInterface.removeColumn(
      'sdtdconfig',
      'serverSentEvents'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'mapProxy',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        default: 0,
      }
    );
    await queryInterface.addColumn(
      'sdtdconfig',
      'serverSentEvents',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0
      }
    );
  }
};
