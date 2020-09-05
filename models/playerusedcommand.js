/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playerusedcommand', {
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
    command: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    player: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'playerusedcommand'
  });
};
