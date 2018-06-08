const Discord = require('discord.js');

/**
 * @class
 * @name CustomDiscordEmbed
 * @description Creates a RichEmbed & loads basic data relevant to this project.
 * [Discord.js MessageEmbed]{@link https://discord.js.org/#/docs/main/master/class/MessageEmbed}
 */

class CustomEmbed extends Discord.RichEmbed {
  constructor(data) {
    super();
    this.setTimestamp();
    this.setTitle(sails.config.custom.botEmbedTitle);
    this.setURL(sails.config.custom.botEmbedLink);
  }
}

class ErrorEmbed extends CustomEmbed {
  constructor(errorMsg) {
    super();
    this.setDescription(`An error occured! See below for more info \n ${errorMsg}`);
    this.setColor('RED');
  }
}

module.exports.CustomEmbed = CustomEmbed;
module.exports.ErrorEmbed = ErrorEmbed;
