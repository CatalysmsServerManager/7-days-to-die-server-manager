'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'player',
      'crossId',
      {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'player',
      'crossId'
    );
  }
};
