'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'slowMode',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        default: 0,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'slowMode'
    );
  }
};
