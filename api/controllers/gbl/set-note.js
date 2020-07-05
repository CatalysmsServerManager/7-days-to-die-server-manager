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
        return foundBan;
      }
    },

    note: {
      required: true,
      type: 'string'
    },

  },


  exits: {
    notAuthorized: {
      description: '',
      statusCode: 403
    }
  },


  fn: async function (inputs, exits) {

    let foundBan = await BanEntry.findOne(inputs.banId);

    let permCheck = await sails.helpers.roles.checkPermission.with({
      userId: this.req.session.user.id,
      serverId: foundBan.server,
      permission: 'manageGbl'
    });

    if (!permCheck.hasPermission) {
      return exits.notAuthorized();
    }

    let updatedRecord = await BanEntry.update({
      id: inputs.banId
    }, {
      note: _.escape(inputs.note)
    });
    sails.log.info(`Update note on ban ${inputs.banId} by user ${this.req.session.user.id} - ${inputs.note}`);
    return exits.success(updatedRecord);

  }


};
