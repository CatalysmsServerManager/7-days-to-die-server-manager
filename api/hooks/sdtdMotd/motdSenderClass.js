const sevenDays = require('machinepack-7daystodiewebapi');
const he = require('he');

/** Class to send MOTD messages */

class MotdSender {
  /**
   * Create the class
   * @param {number} serverId 
   * @param {json} config 
   */
  constructor(serverId, config) {
    this.serverId = serverId;
    this.config = config;
    this.start();
  }

  /**
   * Start it
   */
  async start() {

    try {
      if (!this.config.motdEnabled) {
        throw new Error(`Invalid usage: MOTD is disabled for this server.`);
      }

      let loggingObj = sails.hooks.sdtdlogs.getLoggingObject(this.serverId);
      this.onJoinListener = MotdSender.onJoinListener.bind(this);

      loggingObj.on('playerConnected', this.onJoinListener);

    } catch (error) {
      sails.log.error(`HOOK 7dtdMOTD:motdSenderClass:start - ${error}`);
      throw error;
    }

  }

  /**
   * Stop it
   */
  async stop() {
    try {
      if (this.onJoinListener) {
        let loggingObj = sails.hooks.sdtdlogs.getLoggingObject(this.serverId);
        loggingObj.removeListener('playerConnected', this.onJoinListener);
      }

    } catch (error) {
      sails.log.error(`HOOK 7dtdMOTD:motdSenderClass:stop - ${error}`);
      throw error;
    }

  }

  /**
   * Function to attach to event emitter (loggingObj)
   * @param {json} connectedMessage
   */

  static async onJoinListener(connectedMessage) {
    try {
      await this.sendMotd(this.config.motdMessage, this.serverId, connectedMessage.steamID);
    } catch (error) {
      sails.log.error(`HOOK 7dtdMOTD:motdSenderClass:onJoinListener - ${error}`);
    }
  }

  /**
   * Send the message to the server or a player if steamId is given
   * @param {string} message 
   * @param {number} serverId 
   * @param {string} playerSteamId 
   */
  async sendMotd(message, serverId, playerSteamId) {
    try {
      let server = await SdtdServer.findOne(serverId);
      let player = await Player.find({
        server: server.id,
        steamId: playerSteamId
      });
      player = player[0];

      if (_.isUndefined(server)) {
        return sails.log.error(`HOOKS - sdtdMotd:MotdSender:sendMotd - Unknown server id ${serverId}`);
      }

      if (!_.isUndefined(player)) {
        message = _.replace(message, "${player.name}", he.decode(player.name));
        message = _.replace(message, "${player.currency}", player.currency);
        message = _.replace(message, "${player.positionX}", player.positionX);
        message = _.replace(message, "${player.positionY}", player.positionY);
        message = _.replace(message, "${player.positionZ}", player.positionZ);
        message = _.replace(message, "${player.playtime}", player.playtime);
        message = _.replace(message, "${player.lastOnline}", player.lastOnline);
        message = _.replace(message, "${player.deaths}", player.deaths);
        message = _.replace(message, "${player.playerKills}", player.playerKills);
        message = _.replace(message, "${player.zombieKills}", player.zombieKills);
        message = _.replace(message, "${player.score}", player.score);
        message = _.replace(message, "${player.level}", player.level);
      }

      sevenDays.sendMessage({
        ip: server.ip,
        port: server.webPort,
        authName: server.authName,
        authToken: server.authToken,
        message: message,
        playerID: playerSteamId,
      }).exec({
        success: (response) => {
          sails.log.debug(`HOOKS - sdtdMotd:MotdSender:sendMotd - Successfully sent MOTD message to server ${serverId}`);
        },
        unknownPlayer: (error) => {
          sails.log.error(`HOOKS - sdtdMotd:MotdSender:sendMotd - Tried to send message to unknown player ${serverId}`);
        },
        error: (error) => {
          sails.log.debug(`HOOKS - sdtdMotd:MotdSender:sendMotd - Error when sending motd to ${serverId}`);
        }
      });

    } catch (error) {
      sails.log.error(`HOOKS - sdtdMotd:MotdSender:sendMotd - ${error}`);
    }
  }

}

module.exports = MotdSender;
