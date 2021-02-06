'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dateNow = Date.now();
    await queryInterface.sequelize.query(`UPDATE banneditem set updatedAt=:data,createdAt=:data`, { replacements: { data: dateNow }, type: Sequelize.QueryTypes.UPDATE });
    await queryInterface.sequelize.query(`UPDATE banneditemtier set updatedAt=:data,createdAt=:data`, { replacements: { data: dateNow }, type: Sequelize.QueryTypes.UPDATE });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`UPDATE banneditem set updatedAt=:data,createdAt=:data`, { replacements: { data: null }, type: Sequelize.QueryTypes.UPDATE });
    await queryInterface.sequelize.query(`UPDATE banneditemtier set updatedAt=:data,createdAt=:data`, { replacements: { data: null }, type: Sequelize.QueryTypes.UPDATE });
  }
};
