'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'banneditemtier',
      {
        createdAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
        },
        updatedAt: {
          type: Sequelize.DataTypes.BIGINT,
          allowNull: true,
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
      'banneditem',
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
      try {
        const adminRole = await queryInterface.sequelize.query('select * from role where server = :server order by level ASC limit 1', { type: Sequelize.QueryTypes.SELECT, replacements: { server: config.server } })
        console.log(config.bannedItems);

        let items = [];

        try {
          // This is the expected behavior
          items = JSON.parse(JSON.parse(config.bannedItems));
        } catch (error) {
          try {
            // But sails sometimes stored it like this
            items = JSON.parse(config.bannedItems)
          } catch (error) {
            // If the above fails, data was in a bugged state so we keep the empty array
          }
        }

        const tier = await queryInterface.bulkInsert('banneditemtier', [{ role: adminRole[0].id, command: config.bannedItemsCommand, server: config.server }])

        if (items.length) {
          await queryInterface.bulkInsert('banneditem', items.map(_ => { return { name: _, tier, server: config.server } }));
        }
      } catch (error) {
        console.log(`Error migrating server ${config.server}: ${error}`)
      }

    }

    await queryInterface.removeColumn('sdtdconfig', 'bannedItems')
    await queryInterface.removeColumn('sdtdconfig', 'bannedItemsCommand')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('banneditem')
    await queryInterface.dropTable('banneditemtier')

    await queryInterface.addColumn(
      'sdtdconfig',
      'bannedItems',
      {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        default: [],
      }
    );

    await queryInterface.addColumn(
      'sdtdconfig',
      'bannedItemsCommand',
      {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        default: 'say "unauthorized item detected"',
      }
    );
  }
};
