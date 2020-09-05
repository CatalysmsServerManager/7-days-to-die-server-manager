/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
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
      allowNull: true,
      unique: true
    },
    discordId: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    admin: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    banned: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'user'
  });
};
