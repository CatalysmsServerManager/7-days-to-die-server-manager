'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn('gimmeitem', 'value', {
      type: DataTypes.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    const { DataTypes } = Sequelize;
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('gimmeitem', 'value', {
      type: DataTypes.STRING,
    });
  }
};
