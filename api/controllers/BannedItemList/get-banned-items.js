module.exports = {
  friendlyName: 'Get bannedItems',

  description: 'Gets the list of bannedItems',

  inputs: {
    serverId: {
      required: true,
      type: 'string'
    }
  },

  exits: {},

  fn: async function (inputs, exits) {
    const bannedItems = await BannedItem.find({ server: inputs.serverId }).populate('tier');

    const populated = bannedItems.filter(_ => _.tier).map(async _ => {
      _.tier.role = await Role.findOne(_.tier.role);
      return _;
    });

    const data = await Promise.all(populated);
    return exits.success(data);
  }
};
