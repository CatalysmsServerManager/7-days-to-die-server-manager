const Commando = require('discord.js-commando');

class Restart extends Commando.Command {
    constructor(client) {
        super(client, {
            name: 'restart',
            group: 'meta',
            memberName: 'restart',
            description: 'Restarts the system',
        });
    }

    async run(msg, args) {

        const admins = process.env.CSMM_ADMINS.split(',');
        const adminUsers = await User.find({
            where: {
                steamId: admins,
                discordId: msg.author.id
            }
        });

        if (adminUsers.length) {
            await msg.channel.send(`Request received, I'm shutting down now. 🤖`)
            return process.exit();
        } else {
            return msg.channel.send(`I do not know you! Make sure you have linked your Discord ID to CSMM and you are listed as a CSMM admin in the env variables.`)
        }

    }

}


module.exports = Restart;
