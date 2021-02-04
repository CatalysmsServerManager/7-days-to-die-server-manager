module.exports = {
    friendlyName: 'Import server',
    inputs: {
        data: {
            type: 'ref'
        },
    },

    exits: {},

    fn: async function (inputs, exits) {
        let json;
        try {
            json = JSON.parse(inputs.data);
        } catch (error) {
            return exits.error(new Error('Invalid json'));
        }

        if (!json.server) {
            return exits.error(new Error('No server field in json'));
        }

        const existingServer = await SdtdServer.findOne({ where: { ip: json.server.ip, webPort: json.server.webPort } });

        if (existingServer) {
            return exits.error(new Error('A server with this IP and port already exists'));
        }

        const server = await SdtdServer.create(omitId(json.server)).fetch();
        json.config.server = server.id;
        await SdtdConfig.create(omitId(json.config)).fetch();

        sails.log.info(`Imported server and config`);

        if (json.cronJobs) {
            json.cronJobs = setServerIdForArray(json.cronJobs, server.id);

            for (const cronJob of json.cronJobs) {
                await CronJob.create(omitId(cronJob));
            }

            sails.log.info('Imported cronjobs');
        }

        if (json.customCommands) {
            json.customCommands = setServerIdForArray(
                json.customCommands,
                server.id
            );
            for (const customCmd of json.customCommands) {
                let createdCmd = await CustomCommand.create(
                    omitId(customCmd)
                ).fetch();
                if (json.customArgs) {
                    let customArgs = json.customArgs
                        .filter(arg => arg.command.toString() === customCmd.id.toString())
                        .map(arg => {
                            arg.command = createdCmd.id;
                            return arg;
                        });

                    for (const arg of customArgs) {
                        await CustomCommandArgument.create(omitId(arg));
                    }
                }
            }

            sails.log.info('Imported custom commands');
        }

        if (json.customDiscordNotifications) {
            json.customDiscordNotifications = setServerIdForArray(
                json.customDiscordNotifications,
                server.id
            );
            for (const notification of json.customDiscordNotifications) {
                await CustomDiscordNotification.create(omitId(notification));
            }

            sails.log.info('Imported custom Discord notifications');
        }


        if (json.gimmeItems) {
            json.gimmeItems = setServerIdForArray(json.gimmeItems, server.id);

            for (const gimmeItem of json.gimmeItems) {
                await GimmeItem.create(omitId(gimmeItem));
            }
            sails.log.info('Imported gimme items');

        }

        const importedRoles = [];

        if (json.roles) {
            json.roles = setServerIdForArray(json.roles, server.id);
            for (const role of json.roles) {
                let createdRole = await Role.create(omitId(role)).fetch();
                importedRoles.push(createdRole);
            }
            sails.log.info('Imported roles');

        }


        if (json.players) {

            json.players = setServerIdForArray(json.players, server.id);

            for (const player of json.players) {
                if (player.role) {
                    let oldRole = json.roles.filter(
                        r => r.id.toString() === player.role.toString()
                    )[0];
                    if (!_.isUndefined(oldRole)) {
                        let newRole = importedRoles.filter(
                            r => r.level.toString() === oldRole.level.toString()
                        )[0];
                        player.role = newRole.id;
                    } else {
                        player.role = null;
                    }
                }

                let createdEntry = await Player.create(omitId(player)).fetch();
                let teleports = json.playerTeleports
                    .filter(
                        teleport => teleport.player.toString() === player.id.toString()
                    )
                    .map(teleport => {
                        teleport.player = createdEntry.id;
                        return teleport;
                    });

                for (const teleport of teleports) {
                    await PlayerTeleport.create(omitId(teleport));
                }
            }
            sails.log.info('Imported players');

        }


        if (json.shopListings) {
            json.shopListings = setServerIdForArray(
                json.shopListings,
                server.id
            );

            for (const listing of json.shopListings) {
                await ShopListing.create(omitId(listing));
            }
            sails.log.info('Imported shop listings');

        }

        if (json.customHooks) {
            json.customHooks = setServerIdForArray(json.customHooks, server.id);

            for (const hook of json.customHooks) {
                await CustomHook.create(omitId(hook));
            }
            sails.log.info('Imported custom hooks');
        }

        return exits.success();
    },




};

function omitId(object) {
    return _.omit(object, 'id');
}

function setServerIdForArray(array, serverId) {
    return array.map(element => {
        element.server = serverId;
        return element;
    });
}
