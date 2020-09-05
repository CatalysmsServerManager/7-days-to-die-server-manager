/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customcommandargument', {
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
    key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    allowedValues: {
      type: 'LONGTEXT',
      allowNull: true
    },
    required: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    defaultValue: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    command: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'customcommandargument'
  });
};
