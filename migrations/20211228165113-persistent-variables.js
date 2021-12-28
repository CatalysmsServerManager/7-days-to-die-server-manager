'use strict';

const TABLE_NAME = 'persistentvariable'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
    await queryInterface.createTable(
      TABLE_NAME,
      {
        createdAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER(11),
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING(255),
        },

        value: {
          type: DataTypes.TEXT,
        },

        server: {
          type: DataTypes.INTEGER(11),
          references: { model: 'sdtdserver', key: 'id' },
          onDelete: 'cascade',
        }
      },
      {
        charset: 'utf8mb4'
      }
    );


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
