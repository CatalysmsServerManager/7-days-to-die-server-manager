/**
 * SdtdConfig.js
 *
 * @description Persistent configuration per server for system features
 * @module SdtdConfig
 */

module.exports = {

  attributes: {


    // _______             _    _             
    // |__   __|           | |  (_)            
    //    | |_ __ __ _  ___| | ___ _ __   __ _ 
    //    | | '__/ _` |/ __| |/ / | '_ \ / _` |
    //    | | | | (_| | (__|   <| | | | | (_| |
    //    |_|_|  \__,_|\___|_|\_\_|_| |_|\__, |
    //                                    __/ |
    //                                   |___/ 


    inventoryTracking: {
      type: 'boolean',
      defaultsTo: false
    },

    locationTracking: {
      type: 'boolean',
      defaultsTo: false
    },


    // ______                                      
    // |  ____|                                     
    // | |__   ___ ___  _ __   ___  _ __ ___  _   _ 
    // |  __| / __/ _ \| '_ \ / _ \| '_ ` _ \| | | |
    // | |___| (_| (_) | | | | (_) | | | | | | |_| |
    // |______\___\___/|_| |_|\___/|_| |_| |_|\__, |
    //                                         __/ |
    //                                        |___/ 

    economyEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    currencyName: {
      type: 'string',
      defaultsTo: 'dolla dolla billz'
    },

    killEarnerEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    zombieKillReward: {
      type: 'number',
      min: 0,
      defaultsTo: 1
    },

    playerKillReward: {
      type: 'number',
      min: 0,
      defaultsTo: 20
    },

    playtimeEarnerEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    playtimeEarnerInterval: {
      type: 'number',
      defaultsTo: 5
    },

    playtimeEarnerAmount: {
      type: 'number',
      defaultsTo: 1
    },

    discordTextEarnerEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    discordTextEarnerAmountPerMessage: {
      type: 'number',
      defaultsTo: 0.10
    },

    // How much seconds have to be between messages for a player to get rewarded
    discordTextEarnerTimeout: {
      type: 'number',
      defaultsTo: 3
    },

    discordTextEarnerIgnoredChannels: {
      type: 'json',
      defaultsTo: "[]"
    },

    costToTeleport: {
      type: 'number',
      defaultsTo: 1
    },

    costToSetTeleport: {
      type: 'number',
      defaultsTo: 15
    },

    costToMakeTeleportPublic: {
      type: 'number',
      defaultsTo: 25
    },

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

    enabledCallAdmin: {
      type: 'boolean',
      defaultsTo: false
    },

    enabledPlayerTeleports: {
      type: 'boolean',
      defaultsTo: true
    },

    maxPlayerTeleportLocations: {
      type: 'number',
      defaultsTo: 3
    },

    playerTeleportDelay: {
      type: 'number',
      defaultsTo: 15,
      min: 0,
    },

    playerTeleportTimeout: {
      type: 'number',
      defaultsTo: 60,
      min: 0
    },

    // _____  _                       _ 
    // |  __ \(_)                     | |
    // | |  | |_ ___  ___ ___  _ __ __| |
    // | |  | | / __|/ __/ _ \| '__/ _` |
    // | |__| | \__ \ (_| (_) | | | (_| |
    // |_____/|_|___/\___\___/|_|  \__,_|

    discordPrefix: {
      type: 'string',
      defaultsTo: "$"
    },

    /**
     * @memberof SdtdServer
     * @var {string} discordCommandsChannelId
     * @description A specific discord channel to use for this server
     */

    discordCommandsChannelId: {
      type: 'string'
    },


    /**
     * @memberof SdtdServer
     * @var {string} discordGuildId
     * @description Id of the disccord guild this server is associated with
     */

    discordGuildId: {
      type: 'string'
    },

    /**
     * @memberof SdtdServer
     * @var {string} chatChannelId
     * @description Id of the discord channel for chat bridge
     */

    chatChannelId: {
      type: 'string'
    },

    /**
 * @memberof SdtdServer
 * @var {string} chatChannelRichMessages
 * @description Whether to use rich messages for (dis)connect messages
 */

    chatChannelRichMessages: {
      type: 'boolean',
      defaultsTo: true
    },

    /**
* @memberof SdtdServer
* @var {string} chatChannelBlockedPrefixes
* @description Block messages starting with a certain prefix from chat bridge
*/

    chatChannelBlockedPrefixes: {
      type: 'json',
      defaultsTo: new Array("/", "!")
    },

    /**
     * @memberof SdtdServer
     * @var {string} notificationChannelId
     * @description Id of the discord channel for notifications
     */

    notificationChannelId: {
      type: 'string'
    },


    discordNotificationConfig: {
      type: 'json',
      defaultsTo: {
        systemboot: '',
        playerConnected: '',
        playerDisconnected: '',
        connectionLost: '',
        connected: '',
      },
    },


  //   _____ ____  _      
  //   / ____|  _ \| |     
  //  | |  __| |_) | |     
  //  | | |_ |  _ <| |     
  //  | |__| | |_) | |____ 
  //   \_____|____/|______|
                 
  // How many bans a player must have before triggering the discord notification
  gblNotificationBans: {
    type: 'number',
    defaultsTo: 3
  },

  gblAutoBanEnabled: {
    type: 'boolean',
    defaultsTo: false
  },

  // How many bans a player must have before triggering the auto ban
  gblAutoBanBans: {
    type: 'number',
    defaultsTo: 5
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

    //  _    _ _     _             _           _   _        __      
    // | |  | (_)   | |           (_)         | | (_)      / _|     
    // | |__| |_ ___| |_ ___  _ __ _  ___ __ _| |  _ _ __ | |_ ___  
    // |  __  | / __| __/ _ \| '__| |/ __/ _` | | | | '_ \|  _/ _ \ 
    // | |  | | \__ \ || (_) | |  | | (_| (_| | | | | | | | || (_) |
    // |_|  |_|_|___/\__\___/|_|  |_|\___\__,_|_| |_|_| |_|_| \___/ 

    daysToKeepData: {
      type: 'number',
      defaultsTo: 1
    },

    memUpdateInfoEnabled: {
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
        ban: false,
        bannedCountries: [],
        kickMessage: 'Your country has been blocked on this server.',
        allowNull: true,
        whiteListedSteamIds: []
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

/*   _____ _               _    _      _    
    |  __ (_)             | |  (_)    | |   
    | |__) | _ __   __ _  | | ___  ___| | __
    |  ___/ | '_ \ / _` | | |/ / |/ __| |/ /
    | |   | | | | | (_| | |   <| | (__|   < 
    |_|   |_|_| |_|\__, | |_|\_\_|\___|_|\_\
                    __/ |                   
                   |___/                     */


    pingKickEnabled: {
      type: 'boolean',
      defaultsTo: false
    },

    maxPing: {
      type: 'number',
      min: 1,
      defaultsTo: 150
    },
    
    pingChecksToFail: {
      type: 'number',
      min: 1,
      defaultsTo: 3
    },

    pingKickMessage: {
      type: 'string',
      defaultsTo: "Your ping is too high! Please check your connection."
    },

    pingWhitelist: {
      type: 'json',
      defaultsTo: "[]"
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    /**
     * @var server
     * @description Server this config belongs to
     * @memberof SdtdConfig
     */

    server: {
      required: true,
      //    unique: true,
      model: 'sdtdserver',
    },

  },

};
