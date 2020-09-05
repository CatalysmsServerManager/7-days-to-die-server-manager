/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sdtdserver_admins__user_adminOf', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    sdtdserver_admins: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_adminOf: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'sdtdserver_admins__user_adminOf'
  });
};
