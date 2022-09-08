'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'sdtdconfig',
      'discordPrefix'
    );

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'sdtdconfig',
      'discordPrefix',
      {
        type: Sequelize.DataTypes.STRING,
        defaultValue: '$',
      }
    );
  }
};
