/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shoplisting', {
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
    friendlyName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    iconName: {
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
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    timesBought: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    server: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    createdBy: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'shoplisting'
  });
};
