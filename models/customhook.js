/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customhook', {
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
      allowNull: false,
      primaryKey: true
    },
    event: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    commandsToExecute: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    searchString: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    regex: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    cooldown: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    server: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customhook'
  });
};
