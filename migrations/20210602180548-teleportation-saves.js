'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'savedteleport',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
        },
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER(11),
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        x: {
          type: Sequelize.DataTypes.INTEGER(255),
          allowNull: false,
        },
        y: {
          type: Sequelize.DataTypes.INTEGER(255),
          allowNull: false,
        },
        z: {
          type: Sequelize.DataTypes.INTEGER(255),
          allowNull: false,
        },
        name: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: false,
        },
        server: {
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('savedteleport')
  }
};
