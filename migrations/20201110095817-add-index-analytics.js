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
      'analytics',
      {
        name: 'IDX_analytics_createdAt',
        unique: false,
        fields: ['createdAt']
      }
    );

    await queryInterface.addIndex(
      'analytics',
      {
        name: 'IDX_analytics_server',
        unique: false,
        fields: ['server']
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
      'analytics',
      'IDX_analytics_createdAt'
    );

    await queryInterface.removeIndex(
      'analytics',
      'IDX_analytics_server'
    );
  }
};
