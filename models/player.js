/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('player', {
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
    steamId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    entityId: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    currency: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    positionX: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    positionY: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    positionZ: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    inventory: {
      type: 'LONGTEXT',
      allowNull: true
    },
    playtime: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lastOnline: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    banned: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    deaths: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    zombieKills: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    playerKills: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    score: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    level: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    lastTeleportTime: {
      type: 'LONGTEXT',
      allowNull: true
    },
    server: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    role: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'player'
  });
};
