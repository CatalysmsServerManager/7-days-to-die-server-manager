/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ticketcomment', {
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
    commentText: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ticket: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    userThatPlacedTheComment: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'ticketcomment'
  });
};
