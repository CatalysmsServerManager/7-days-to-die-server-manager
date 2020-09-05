/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('historicalinfo', {
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
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    message: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fps: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    heap: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    chunks: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    zombies: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    entities: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    players: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    items: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rss: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    uptime: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    economyAction: {
      type: DataTypes.STRING(255),
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
    tableName: 'historicalinfo'
  });
};
