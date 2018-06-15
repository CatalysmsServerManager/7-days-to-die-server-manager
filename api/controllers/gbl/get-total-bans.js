module.exports = {


    friendlyName: 'Get total bans',


    description: '',


    inputs: {

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        let serverBans = await BanEntry.count();

        return exits.success(serverBans);

    }


};
