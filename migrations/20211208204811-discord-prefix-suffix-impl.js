'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'chatBridgeDCPrefix',
      {
        type: Sequelize.DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      }
    );
    await queryInterface.addColumn(
      'sdtdconfig',
      'chatBridgeDCSuffix',
      {
        type: Sequelize.DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: null,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'chatBridgeDCPrefix'
    );
    await queryInterface.removeColumn(
      'sdtdconfig',
      'chatBridgeDCSuffix'
    );
  }
};