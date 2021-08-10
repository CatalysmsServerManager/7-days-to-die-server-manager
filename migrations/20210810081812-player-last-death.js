'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'player',
      'lastDeathLocationX',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      }
    );
    await queryInterface.addColumn(
      'player',
      'lastDeathLocationY',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      }
    );
    await queryInterface.addColumn(
      'player',
      'lastDeathLocationZ',
      {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'player',
      'lastDeathLocationX'
    );
    await queryInterface.removeColumn(
      'player',
      'lastDeathLocationY'
    );
    await queryInterface.removeColumn(
      'player',
      'lastDeathLocationZ'
    );
  }
};
