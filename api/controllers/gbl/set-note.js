const he = require('he');

module.exports = {


    friendlyName: 'Set note',


    description: 'Add or edit a note to a ban entry',


    inputs: {

        banId: {
            required: true,
            type: 'number',
            custom: async function (valueToCheck) {
                let foundBan = await BanEntry.findOne(valueToCheck);
                return foundBan
            }
        },

        note: {
            required: true,
            type: 'string'
        },

    },


    exits: {

    },


    fn: async function (inputs, exits) {

        let updatedRecord = await BanEntry.update({ id: inputs.banId }, { note: he.encode(inputs.note) });
        sails.log.info(`Update note on ban ${inputs.banId} - ${inputs.note}`)
        return exits.success(updatedRecord);

    }


};
