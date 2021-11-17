'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex(
      'trackinginfo',
      {
        name: 'IDX_trackinginfo_server_createdAt',
        fields: ['server', 'createdAt']
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex(
      'trackinginfo',
      'IDX_trackinginfo_server_createdAt'
    );
  }
};
