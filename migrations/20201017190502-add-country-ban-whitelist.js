'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'countryBanListMode',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'countryBanListMode'
    );
  }
};
