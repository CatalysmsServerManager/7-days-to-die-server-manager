const Discord = require('discord.js');

/**
 * @class
 * @name CustomDiscordEmbed
 * @description Creates a RichEmbed & loads basic data relevant to this project.
 * [Discord.js RichEmbed]{@link https://discord.js.org/#/docs/main/stable/class/RichEmbed}
 */

class CustomEmbed extends Discord.RichEmbed {
    constructor(data) {
        super()
        this.setTimestamp();
        this.setTitle(sails.config.custom.botEmbedTitle);
        this.setURL(sails.config.custom.botEmbedLink);
    }
}

module.exports = CustomEmbed