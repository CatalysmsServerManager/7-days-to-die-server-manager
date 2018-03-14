const Commando = require('discord.js-commando');
const findSdtdServer = require('../../util/findSdtdServer.js');

class IdentifyServer extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'identifyserver',
            group: 'meta',
            memberName: 'identifyserver',
            description: '',
            details: "Show what server commands will be relating to",
        });
    }

    async run(msg, args) {
        let sdtdServer = await findSdtdServer(msg);

        msg.channel.send(sdtdServer.name)

    }

}


module.exports = IdentifyServer;
