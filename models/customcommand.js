/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customcommand', {
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
    costToExecute: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    aliases: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    commandsToExecute: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enabled: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    delay: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    timeout: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    sendOutput: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    level: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    server: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customcommand'
  });
};
