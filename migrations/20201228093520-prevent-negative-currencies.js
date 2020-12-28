'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const Op = Sequelize.Op

    // If any negative currencies currently exist, set them to 0 before changing the datatype
    await queryInterface.bulkUpdate('player', { currency: 0 }, { currency: { [Op.lt]: 0 } })
    await queryInterface.changeColumn('player', 'currency', Sequelize.DOUBLE.UNSIGNED)

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn('player', 'currency', Sequelize.DOUBLE)
  }
};
