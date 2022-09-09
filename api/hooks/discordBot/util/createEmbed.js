const { EmbedBuilder } = require('discord.js');

/**
 * @class
 * @name CustomDiscordEmbed
 * @description Creates a MessageEmbed & loads basic data relevant to this project.
 * [Discord.js MessageEmbed]{@link https://discord.js.org/#/docs/main/master/class/MessageEmbed}
 */

class CustomEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setTitle(sails.config.custom.botEmbedTitle);
    this.setURL(sails.config.custom.botEmbedUrl);
  }

}

class ErrorEmbed extends CustomEmbed {
  constructor(errorMsg) {
    super();
    this.setDescription(`An error occured! See below for more info \n ${errorMsg}`);
    this.setColor('Red');
  }
}

module.exports.CustomEmbed = CustomEmbed;
module.exports.ErrorEmbed = ErrorEmbed;
