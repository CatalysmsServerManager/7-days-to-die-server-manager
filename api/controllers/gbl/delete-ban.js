module.exports = {


    friendlyName: 'delete ban',


    description: 'Delete a ban from the GBL record',


    inputs: {
        banId: {
            required: true,
            type: 'string'
        }
    },


    exits: {

    },


    fn: async function (inputs, exits) {

        await BanEntry.destroy({id: inputs.banId});

        return exits.success();

    }


};
