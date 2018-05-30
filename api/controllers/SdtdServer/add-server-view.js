module.exports = {

    friendlyName: 'Server addserver view',
  
    description: '',
  
    inputs: {
    },
  
    exits: {
      success: {
        responseType: 'view',
        viewTemplatePath: 'sdtdServer/addserver'
      },
    },
  

    fn: async function (inputs, exits) {
        return exits.success();
  
    }
  };
  