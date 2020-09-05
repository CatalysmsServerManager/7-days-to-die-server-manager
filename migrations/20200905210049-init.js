'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable(
      'user',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true
        },
        steamId: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true,
          unique: true
        },
        discordId: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        username: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        avatar: {
          type: Sequelize.DataTypes.STRING(255),
          allowNull: true
        },
        admin: {
          type: Sequelize.DataTypes.INTEGER(1),
          allowNull: true
        },
        banned: {
          type: Sequelize.DataTypes.INTEGER(1),
          allowNull: true
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
