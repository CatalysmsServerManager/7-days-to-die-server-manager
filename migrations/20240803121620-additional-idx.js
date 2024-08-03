"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex("banentry", {
      name: "IDX_banentry_steamId_server",
      unique: false,
      fields: ["steamId", "server"],
    });

    await queryInterface.addIndex("player", {
      name: "IDX_player_user",
      unique: false,
      fields: ["user"],
    });

    await queryInterface.addIndex("player", {
      name: "IDX_player_crossId",
      unique: false,
      fields: ["crossId"],
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("banentry", "IDX_banentry_steamId_server");
    await queryInterface.removeIndex("player", "IDX_player_user");
    await queryInterface.removeIndex("player", "IDX_player_crossId");
  },
};
