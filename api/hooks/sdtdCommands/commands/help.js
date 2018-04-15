let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class help extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'help',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, player, server, args) {
        return chatMessage.reply('RTFM! :D - http://csmm.readthedocs.io')
    }
}

module.exports = help;
