/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('trackinginfo', {
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
    inventory: {
      type: 'LONGTEXT',
      allowNull: true
    },
    server: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    player: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'trackinginfo'
  });
};
