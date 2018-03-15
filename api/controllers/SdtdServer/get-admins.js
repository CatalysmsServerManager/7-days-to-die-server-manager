module.exports = {


    friendlyName: 'Get admins of a server',
  
  
    description: 'Loads data about all admins for a server',
  
  
    inputs: {
      serverId: {
        required: true,
        example: 4
      }
  
    },
  
    exits: {
      notFound: {
        description: 'Server with given ID was not found in the system'
      },
      badRequest: {
        responseType: 'badRequest'
      },
      notFound: {
        responseType: 'notFound',
        description: 'Server was not found in DB'
      }
    },
  
    fn: async function (inputs, exits) {

        let server = await SdtdServer.findOne({id: inputs.serverId}).populate('admins');
        
        if (server) {
            return exits.success(server.admins);
        } else {
            return exits.notFound();
        }
    }
  
  
  };
  