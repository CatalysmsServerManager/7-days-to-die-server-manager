/**
 * SdtdConfig.js
 *
 * @description Persistent configuration per server for system features
 * @module SdtdConfig
 */

module.exports = {

  attributes: {


    //   _____                                          _     
    //  / ____|                                        | |    
    // | |     ___  _ __ ___  _ __ ___   __ _ _ __   __| |___ 
    // | |    / _ \| '_ ` _ \| '_ ` _ \ / _` | '_ \ / _` / __|
    // | |___| (_) | | | | | | | | | | | (_| | | | | (_| \__ \
    //  \_____\___/|_| |_| |_|_| |_| |_|\__,_|_| |_|\__,_|___/

    /**
     * @memberof SdtdConfig
     * @var {boolean} commandsEnabled
     * @description Whether or not ingame commands are enabled
     * @default false
     */

    commandsEnabled: {
      type: 'boolean',
      defaultsTo: false
    },


    /**
     * @memberof SdtdConfig
     * @var {string} commandPrefix
     * @description Command prefix to use ingame
     */

    commandPrefix: {
      type: 'string',
      defaultsTo: '$'
    },

    /**
     * @memberof SdtdConfig
     * @var {json} enabledCommands
     * @description json of enabled commands
     */

    enabledCommands: {
      type: 'json',
      defaultsTo: {
        sayHi: true,
        callAdmin: true
      }
    },




    //   _                       _             
    //  | |                     (_)            
    //  | |     ___   __ _  __ _ _ _ __   __ _ 
    //  | |    / _ \ / _` |/ _` | | '_ \ / _` |
    //  | |___| (_) | (_| | (_| | | | | | (_| |
    //  |______\___/ \__, |\__, |_|_| |_|\__, |
    //                __/ | __/ |         __/ |
    //               |___/ |___/         |___/ 

    /**
     * @memberof SdtdConfig
     * @var {boolean} loggingEnabled
     * @description Whether or not logging is enabled
     * @default true
     */

    loggingEnabled: {
      type: 'boolean',
      defaultsTo: true
    },

    //   _____                  _                _                 
    //  / ____|                | |              | |                
    // | |     ___  _   _ _ __ | |_ _ __ _   _  | |__   __ _ _ __  
    // | |    / _ \| | | | '_ \| __| '__| | | | | '_ \ / _` | '_ \ 
    // | |___| (_) | |_| | | | | |_| |  | |_| | | |_) | (_| | | | |
    //  \_____\___/ \__,_|_| |_|\__|_|   \__, | |_.__/ \__,_|_| |_|
    //                                    __/ |                    
    //                                   |___/                     

    /**
     * @memberof SdtdConfig
     * @var {json} countryBanConfig
     * @description Config for country ban
     */

    countryBanConfig: {
      type: 'json',
      defaultsTo: {
        enabled: false,
        bannedCountries: [],
        kickMessage: 'Your country has been blocked on this server.',
        allowNull: true
      },
    },

    // __  __  ____ _______ _____  
    // |  \/  |/ __ \__   __|  __ \ 
    // | \  / | |  | | | |  | |  | |
    // | |\/| | |  | | | |  | |  | |
    // | |  | | |__| | | |  | |__| |
    // |_|  |_|\____/  |_|  |_____/ 

    /**
     * @memberof SdtdConfig
     * @var {boolean} motdEnabled
     */

    motdEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * @memberof SdtdConfig
     * @var {string} motdMessage
     * @description Message to be sent
     */

    motdMessage: {
      type: 'string',
      defaultsTo: 'Enjoy playing on this server!'
    },

    /**
     * @memberof SdtdConfig
     * @var {boolean} motdOnJoinEnabled
     * @description Wheter MOTD message should be sent to players on joining
     */

    motdOnJoinEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * @memberof SdtdConfig
     * @var {number} motdInterval
     * @description Interval the message is sent in minutes
     */

    motdInterval: {
      type: 'number',
      defaultsTo: 20
    },


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
     * @var server
     * @description Server this config belongs to
     * @memberof module:SdtdCommandsHook
     */

    server: {
      model: 'sdtdserver',
      required: true
    },

  },

};
