module.exports = {

    friendlyName: 'Dashboard',
 
    description: 'Show the dashboard of a 7 Days to Die server',
 
    inputs: {
       serverId: {
         description: 'The ID of the server to look up.',
         type: 'number',
         required: true
       }
    },
 
    exits: {
       success: {
         responseType: 'view',
         viewTemplatePath: 'sdtdServer/dashboard'
       },
       notFound: {
         description: 'No server with the specified ID was found in the database.',
         responseType: 'notFound'
       }
    },
 
    fn: async function (inputs, exits) {

        let sdtdServer = await sails.helpers.loadSdtdserverInfo(inputs.serverId)

       // Display the dashboard
       return exits.success({server: sdtdServer});
    }
 };