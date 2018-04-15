const sevenDays = require('machinepack-7daystodiewebapi');

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

      if (this.config.motdInterval) {
        this.motdInterval = setInterval(() => {
          this.sendMotd(this.config.motdMessage, this.serverId);
        }, this.config.motdInterval * 1000 * 60);
      }

      if (this.config.motdOnJoinEnabled) {
        let loggingObj = sails.hooks.sdtdlogs.getLoggingObject(this.serverId);
        this.onJoinListener = MotdSender.onJoinListener.bind(this);

        loggingObj.on('playerConnected', this.onJoinListener);
      }
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

      if (this.motdInterval) {
        clearInterval(this.motdInterval);
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

      if (_.isUndefined(server)) {
        return sails.log.error(`HOOKS - sdtdMotd:MotdSender:sendMotd - Unknown server id ${serverId}`);
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
