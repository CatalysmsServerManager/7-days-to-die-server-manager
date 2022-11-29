'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'persistentvariable',
      'preventDeletion',
      {
        type: Sequelize.DataTypes.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'persistentvariable',
      'preventDeletion'
    );
  }
};
