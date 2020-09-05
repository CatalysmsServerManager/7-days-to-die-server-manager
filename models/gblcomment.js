/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gblcomment', {
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
    content: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    deleted: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    user: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    ban: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'gblcomment'
  });
};
