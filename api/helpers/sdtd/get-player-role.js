module.exports = {


    friendlyName: 'Get player role',


    description: '',


    inputs: {

        playerId: {
            required: true,
            type: 'number',
            custom: async (valueToCheck) => {
              let foundPlayer = await Player.findOne(valueToCheck);
              return foundPlayer
            },
          },

    },


    exits: {
        success: {
            outputFriendlyName: 'Success',
            outputType: 'json'
        },

    },

    fn: async function (inputs, exits) {

        let player = await Player.findOne(inputs.playerId);

        let foundRole;

        let amountOfRoles = await Role.count({server: player.server});

        if (amountOfRoles === 0) {
            await Role.create({
                    name: "Default role",
                    level: 9999,
                    server: player.server
            })
        }

        if (player.role) {
            foundRole = await Role.findOne(player.role);
        } else {
            foundRole = await Role.find({
                where: {
                    server: player.server
                },
                sort: 'level DESC',
                limit: 1
            });
            foundRole = foundRole[0]
        }

        return exits.success(foundRole);

    }


};
