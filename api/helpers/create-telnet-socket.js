module.exports = {


    friendlyName: 'Create telnet socket',


    description: 'Connects to a server, returns a telnet socker',


    inputs: {
        id: {
            type: "number",
            description: "ID of server to connect to",
            required: true
        }
    },


    exits: {

    },


    fn: async function(inputs, exits) {

        const serverID = inputs.id;
        const server = await sails.models.sdtdserver.findOne(serverID);

        let connection = await sails.helpers.connectToTelnet({
            ip: server.ip,
            port: server.telnetPort,
            password: server.telnetPassword
        })

        let telnetSocket = connection.getSocket()

        return exits.success(telnetSocket)

    }


};