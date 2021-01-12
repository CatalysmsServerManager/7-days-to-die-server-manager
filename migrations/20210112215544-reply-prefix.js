'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'replyPrefix',
      {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
        default: '',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'replyPrefix'
    );
  }
};
