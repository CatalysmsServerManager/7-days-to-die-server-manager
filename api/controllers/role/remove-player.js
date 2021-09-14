module.exports = {


  friendlyName: 'Remove player',


  description: '',



  inputs: {

    playerId: {
      type: 'number',
      required: true,
      custom: async (valueToCheck) => {
        let foundPlayer = await Player.findOne(valueToCheck);
        return foundPlayer;
      },
    },

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    let updatedPlayer = await Player.update({id: inputs.playerId}, {role: null}).fetch();

    sails.log.debug(`Removed a players role on server ${updatedPlayer[0].server} for player ${updatedPlayer[0].id} - ${updatedPlayer[0].name}`,
      {
        player: updatedPlayer[0],
        server: updatedPlayer[0].server,
      });

    return exits.success(updatedPlayer);

  }


};
