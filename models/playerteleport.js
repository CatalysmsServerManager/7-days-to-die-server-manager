/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('playerteleport', {
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
    x: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    y: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    z: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    public: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    timesUsed: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    player: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'playerteleport'
  });
};
