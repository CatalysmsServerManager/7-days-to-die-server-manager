const Commando = require('discord.js-commando');

/**
 * @memberof module:DiscordCommands
 * @name AddServer
 * @description Adds a server to the system
 * @param {string} ip
 * @param {integer} webPort
 * @param {integer} telnetPort
 * @param {string} telnetPassword
 */

class AddServer extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'addserver',
      group: '7dtd',
      memberName: 'addserver',
      args: [{
        key: 'ip',
        label: 'IP',
        prompt: 'Specify the server ip please',
        type: 'string'
      },
      {
        key: 'webPort',
        label: 'Web port',
        prompt: 'Specify the server web port please (Allocs port)',
        type: 'integer'
      },
      {
        key: 'telnetPort',
        label: 'Telnet port',
        prompt: 'Specify a telnet port please',
        type: 'integer'
      },
      {
        key: 'telnetPassword',
        label: 'Telnet password',
        prompt: 'Please specify your telnet password',
        type: 'string'
      }
      ],
      description: 'Adds a server to the system',
      details: 'For more information see the website',
      userPermissions: ['MANAGE_GUILD']
    });
  }

  async run(msg, args) {
    try {
      let statusMessage = await msg.channel.send(`Got your request, hold on while we verify info of your server`);

      msg.delete({
        reason: 'Deleting sensitive info'
      }).then(() => {
        sails.log.debug('Deleted setup message');
      })
        .catch(err => {
          sails.log.debug(`Could not delete a setup message from discord`);
          statusMessage.edit(statusMessage.content + '\n:warning: Could not delete the original message! Make sure your telnet password is safe');
        });

      let user = await User.findOrCreate({
        discordId: msg.author.id
      }, {
        discordId: msg.author.id,
        username: msg.author.username
      });
      return sails.helpers.add7DtdServer.with({
        ip: args.ip,
        telnetPort: args.telnetPort,
        telnetPassword: args.telnetPassword,
        webPort: args.webPort,
        owner: user.id,
        discordGuildId: msg.guild.id
      }).switch({
        error: function (err) {
          sails.log.error(`DISCORD - COMMAND addServer - ${err}`);
          let errorEmbed = new msg.client.customEmbed();
          errorEmbed
            .setDescription(`Could not initialize your server, something went wrong!`)
            .addField('IP', args.ip, true)
            .addField('Web port', args.webPort, true)
            .addField('Error', err)
            .setColor('RED');
          msg.channel.send(errorEmbed);
        },
        success: function (server) {
          let successEmbed = new msg.client.customEmbed();
          successEmbed
            .setDescription(`Successfully initialized your server!`)
            .addField('IP', server.ip, true)
            .addField('Web port', server.webPort, true)
            .setColor('GREEN');
          return msg.channel.send(successEmbed);
        }
      });
    } catch (error) {
      sails.log.error(`DISCORD - COMMAND addServer - ${error}`);
      let errorEmbed = new msg.client.customEmbed();
      errorEmbed
        .setDescription(`Could not initialize your server, something went wrong!`)
        .addField('Error', error)
        .setColor('RED');
      msg.channel.send(errorEmbed);

    }

  }

}


module.exports = AddServer;
