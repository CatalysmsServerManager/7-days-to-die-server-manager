module.exports = {


    friendlyName: 'Transact between players',
  
  
    description: 'Transacts an amount between two players',
  
  
    inputs: {
  
      fromPlayerId: {
        type: 'number',
        required: true
      },

      toPlayerId: {
        type: 'number',
        required: true
      },

      amount: {
          type: 'number',
          required: true
      }
  
    },
  
  
    exits: {
      success: {
        outputFriendlyName: 'Success',
        outputType: 'boolean'
      },
      notAvailable: {
        outputFriendlyName: 'Not available',
        description: 'The server could not be reached'
      }
    },
  
    fn: async function (inputs, exits) {

        try {
            await sails.helpers.economy.giveToPlayer(inputs.toPlayerId, inputs.amount);
            await sails.helpers.economy.deductFromPlayer(inputs.fromPlayerId, inputs.amount);
        } catch (error) {
            sails.log.error(`HELPER economy:transact-between-players - ${error}`);
            return exits.error(error);
        }
  
    }
  };
  
  