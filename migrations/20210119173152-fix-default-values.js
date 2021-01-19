'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.changeColumn('sdtdconfig', 'slowMode', {
      type: Sequelize.DataTypes.TINYINT(1),
      defaultValue: 0
    });

    await queryInterface.changeColumn('customhook', 'caseSensitive', {
      type: Sequelize.DataTypes.TINYINT(1),
      defaultValue: 1
    });

    await queryInterface.changeColumn('sdtdconfig', 'replyPrefix', {
      type: Sequelize.DataTypes.STRING(255),
      defaultValue: ''
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
