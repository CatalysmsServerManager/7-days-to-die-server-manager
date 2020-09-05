/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('gblcomment_heartedBy__user_heartedGblComment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    gblcomment_heartedBy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    user_heartedGblComment: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'gblcomment_heartedBy__user_heartedGblComment'
  });
};
