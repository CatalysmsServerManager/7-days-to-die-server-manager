let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class CsmmFeedback extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'csmmfeedback',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, player, server, args) {
        
       try {
           let discordClient = sails.hooks.discordbot.getClient();
           let feedbackChannel = discordClient.channels.get(sails.config.custom.discordFeedbackChannel);

           let embedToSend = new discordClient.customEmbed()

        embedToSend.setTitle(`Feedback`)
        .addField(`Player`, player.name)
        .addField(`Server`, server.name)
        .setDescription(args.join(' '))

         let messageSent = await feedbackChannel.send(embedToSend);
        await messageSent.react('👍')
        await messageSent.react('👌')
        await messageSent.react('👎')

       } catch (error) {
           sails.log.error(error);
           chatMessage.reply(`An error occured! Please report this on the dev server.`)
       }
    }
}

module.exports = CsmmFeedback;
