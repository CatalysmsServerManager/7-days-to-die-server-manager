'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'bannedItemTier',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
          defaultValue: Sequelize.fn('NOW')
        },
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER(11),
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        role: {
          type: Sequelize.DataTypes.INTEGER(255),
          allowNull: false,
          unique: true
        },
        command: {
          type: Sequelize.DataTypes.TEXT,
          allowNull: false,
          defaultValue: 'kick ${player.steamId} "Unauthorized item detected in inventory"'
        },
        server: {
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false
        }
      }
    );

    await queryInterface.createTable(
      'bannedItem',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true
        },
        id: {
          autoIncrement: true,
          type: Sequelize.DataTypes.INTEGER(11),
          unique: true,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
        },
        tier: {
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false,
        },
        server: {
          type: Sequelize.DataTypes.INTEGER(11),
          allowNull: false
        }
      }
    );

    // With the new tables created, we now migrate the old data to new structure

    const configs = await queryInterface.sequelize.query('SELECT server, bannedItems, bannedItemsCommand from sdtdconfig', { type: Sequelize.QueryTypes.SELECT });
    console.log(configs);

    for (const config of configs) {
      const adminRole = await queryInterface.sequelize.query('select * from role where server = :server order by level ASC limit 1', { type: Sequelize.QueryTypes.SELECT, replacements: { server: config.server } })
      const items = JSON.parse(JSON.parse(config.bannedItems));
      const tier = await queryInterface.bulkInsert('bannedItemTier', [{ role: adminRole[0].id, command: config.bannedItemsCommand, server: config.server }])
      await queryInterface.bulkInsert('bannedItem', items.map(_ => { return { name: _, tier, server: config.server } }));
    }

    await queryInterface.removeColumn('sdtdconfig', 'bannedItems')
    await queryInterface.removeColumn('sdtdconfig', 'bannedItemsCommand')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('bannedItem')
    await queryInterface.dropTable('bannedItemTier')
  }
};
