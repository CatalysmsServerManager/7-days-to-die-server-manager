let SdtdCommand = require('./command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class CustomCommand extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'customCommand',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, player, server, args) {

        console.log('CUSTOM COMMAND RUN YOOOO')
    }
}

module.exports = CustomCommand;
