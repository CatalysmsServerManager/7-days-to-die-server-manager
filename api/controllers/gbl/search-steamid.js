module.exports = {


    friendlyName: 'Search by steamID',


    description: 'Search the GBL by steam ID',


    inputs: {

        steamId: {
            required: true,
            type: 'string',
        },

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        let foundBans = await BanEntry.find({steamId: inputs.steamId}).populate('server');
        foundBans.server = _.omit(foundBans.server, "authName", "authToken");
        sails.log.info(`Searched the global ban list for ${inputs.steamId} - found ${foundBans.length} entries`);
        return exits.success(foundBans);

    }


};
