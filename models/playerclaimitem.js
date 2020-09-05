/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playerclaimitem', {
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
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    quality: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    claimed: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    player: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'playerclaimitem'
  });
};
