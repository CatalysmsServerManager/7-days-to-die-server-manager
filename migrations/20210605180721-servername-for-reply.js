'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'sdtdconfig',
      'replyServerName',
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
      'replyServerName'
    );
  }
};
