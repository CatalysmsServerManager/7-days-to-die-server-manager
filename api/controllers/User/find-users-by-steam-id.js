module.exports = {


    friendlyName: 'Find a CSMM user by steam ID',
  
  
    description: '',
  
  
    inputs: {
      steamId: {
        required: true,
        example: '1337'
      }
  
    },
  
    exits: {
      badRequest: {
        responseType: 'badRequest'
      },
      notFound: {
          responseType: 'notFound'
      }
    },
  
    /**
       * @memberof SdtdServer
       * @method
       * @name find-users-by-steam-id
       * @param {number} steamId
       * @returns {array}
       */
  
    fn: async function (inputs, exits) {
        let foundUser = await User.findOne({steamId: inputs.steamId});
        if (foundUser) {
            return exits.success(foundUser);
        } else {
            exits.notFound();
        }
    }
  
  
  };
  