'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'customhook',
      'caseSensitive',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        default: 1,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'customhook',
      'caseSensitive'
    );
  }
};
