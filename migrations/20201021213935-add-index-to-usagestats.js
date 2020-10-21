'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addIndex(
      'usagestats',
      {
        name: 'IDX_usagestats_createdAt',
        unique: false,
        fields: ['createdAt']
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex(
      'usagestats',
      'IDX_usagestats_createdAt'
    );
  }
};
