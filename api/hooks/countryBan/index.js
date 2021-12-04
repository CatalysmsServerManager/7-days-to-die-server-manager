/**
 * @module 7dtdCountryBan
 * @description Restrict certain countries access to a server
 */
module.exports = function sdtdCountryBan(sails) {
  let countryBanInfoMap = new Map();

  return {
    config: {
      enabled: true,
      bannedCountries: [],
      kickMessage: 'Your country has been blocked on this server.',
      allowNull: true
    },

    countryList: [
      ['A1', 'Anonymous Proxy'],
      ['A2', 'Satellite Provider'],
      ['O1', 'Other Country'],
      ['AD', 'Andorra'],
      ['AE', 'United Arab Emirates'],
      ['AF', 'Afghanistan'],
      ['AG', 'Antigua and Barbuda'],
      ['AI', 'Anguilla'],
      ['AL', 'Albania'],
      ['AM', 'Armenia'],
      ['AO', 'Angola'],
      ['AP', 'Asia/Pacific Region'],
      ['AQ', 'Antarctica'],
      ['AR', 'Argentina'],
      ['AS', 'American Samoa'],
      ['AT', 'Austria'],
      ['AU', 'Australia'],
      ['AW', 'Aruba'],
      ['AX', 'Aland Islands'],
      ['AZ', 'Azerbaijan'],
      ['BA', 'Bosnia and Herzegovina'],
      ['BB', 'Barbados'],
      ['BD', 'Bangladesh'],
      ['BE', 'Belgium'],
      ['BF', 'Burkina Faso'],
      ['BG', 'Bulgaria'],
      ['BH', 'Bahrain'],
      ['BI', 'Burundi'],
      ['BJ', 'Benin'],
      ['BL', 'Saint Bartelemey'],
      ['BM', 'Bermuda'],
      ['BN', 'Brunei Darussalam'],
      ['BO', 'Bolivia'],
      ['BQ', 'Bonaire, Saint Eustatius and Saba'],
      ['BR', 'Brazil'],
      ['BS', 'Bahamas'],
      ['BT', 'Bhutan'],
      ['BV', 'Bouvet Island'],
      ['BW', 'Botswana'],
      ['BY', 'Belarus'],
      ['BZ', 'Belize'],
      ['CA', 'Canada'],
      ['CC', 'Cocos (Keeling) Islands'],
      ['CD', 'Congo, The Democratic Republic of the'],
      ['CF', 'Central African Republic'],
      ['CG', 'Congo'],
      ['CH', 'Switzerland'],
      ['CI', 'Cote d\'Ivoire'],
      ['CK', 'Cook Islands'],
      ['CL', 'Chile'],
      ['CM', 'Cameroon'],
      ['CN', 'China'],
      ['CO', 'Colombia'],
      ['CR', 'Costa Rica'],
      ['CU', 'Cuba'],
      ['CV', 'Cape Verde'],
      ['CW', 'Curacao'],
      ['CX', 'Christmas Island'],
      ['CY', 'Cyprus'],
      ['CZ', 'Czech Republic'],
      ['DE', 'Germany'],
      ['DJ', 'Djibouti'],
      ['DK', 'Denmark'],
      ['DM', 'Dominica'],
      ['DO', 'Dominican Republic'],
      ['DZ', 'Algeria'],
      ['EC', 'Ecuador'],
      ['EE', 'Estonia'],
      ['EG', 'Egypt'],
      ['EH', 'Western Sahara'],
      ['ER', 'Eritrea'],
      ['ES', 'Spain'],
      ['ET', 'Ethiopia'],
      ['EU', 'Europe'],
      ['FI', 'Finland'],
      ['FJ', 'Fiji'],
      ['FK', 'Falkland Islands (Malvinas)'],
      ['FM', 'Micronesia, Federated States of'],
      ['FO', 'Faroe Islands'],
      ['FR', 'France'],
      ['GA', 'Gabon'],
      ['GB', 'United Kingdom'],
      ['GD', 'Grenada'],
      ['GE', 'Georgia'],
      ['GF', 'French Guiana'],
      ['GG', 'Guernsey'],
      ['GH', 'Ghana'],
      ['GI', 'Gibraltar'],
      ['GL', 'Greenland'],
      ['GM', 'Gambia'],
      ['GN', 'Guinea'],
      ['GP', 'Guadeloupe'],
      ['GQ', 'Equatorial Guinea'],
      ['GR', 'Greece'],
      ['GS', 'South Georgia and the South Sandwich Islands'],
      ['GT', 'Guatemala'],
      ['GU', 'Guam'],
      ['GW', 'Guinea-Bissau'],
      ['GY', 'Guyana'],
      ['HK', 'Hong Kong'],
      ['HM', 'Heard Island and McDonald Islands'],
      ['HN', 'Honduras'],
      ['HR', 'Croatia'],
      ['HT', 'Haiti'],
      ['HU', 'Hungary'],
      ['ID', 'Indonesia'],
      ['IE', 'Ireland'],
      ['IL', 'Israel'],
      ['IM', 'Isle of Man'],
      ['IN', 'India'],
      ['IO', 'British Indian Ocean Territory'],
      ['IQ', 'Iraq'],
      ['IR', 'Iran, Islamic Republic of'],
      ['IS', 'Iceland'],
      ['IT', 'Italy'],
      ['JE', 'Jersey'],
      ['JM', 'Jamaica'],
      ['JO', 'Jordan'],
      ['JP', 'Japan'],
      ['KE', 'Kenya'],
      ['KG', 'Kyrgyzstan'],
      ['KH', 'Cambodia'],
      ['KI', 'Kiribati'],
      ['KM', 'Comoros'],
      ['KN', 'Saint Kitts and Nevis'],
      ['KP', 'Korea, Democratic People\'s Republic of'],
      ['KR', 'Korea, Republic of'],
      ['KW', 'Kuwait'],
      ['KY', 'Cayman Islands'],
      ['KZ', 'Kazakhstan'],
      ['LA', 'Lao People\'s Democratic Republic'],
      ['LB', 'Lebanon'],
      ['LC', 'Saint Lucia'],
      ['LI', 'Liechtenstein'],
      ['LK', 'Sri Lanka'],
      ['LR', 'Liberia'],
      ['LS', 'Lesotho'],
      ['LT', 'Lithuania'],
      ['LU', 'Luxembourg'],
      ['LV', 'Latvia'],
      ['LY', 'Libyan Arab Jamahiriya'],
      ['MA', 'Morocco'],
      ['MC', 'Monaco'],
      ['MD', 'Moldova, Republic of'],
      ['ME', 'Montenegro'],
      ['MF', 'Saint Martin'],
      ['MG', 'Madagascar'],
      ['MH', 'Marshall Islands'],
      ['MK', 'Macedonia'],
      ['ML', 'Mali'],
      ['MM', 'Myanmar'],
      ['MN', 'Mongolia'],
      ['MO', 'Macao'],
      ['MP', 'Northern Mariana Islands'],
      ['MQ', 'Martinique'],
      ['MR', 'Mauritania'],
      ['MS', 'Montserrat'],
      ['MT', 'Malta'],
      ['MU', 'Mauritius'],
      ['MV', 'Maldives'],
      ['MW', 'Malawi'],
      ['MX', 'Mexico'],
      ['MY', 'Malaysia'],
      ['MZ', 'Mozambique'],
      ['NA', 'Namibia'],
      ['NC', 'New Caledonia'],
      ['NE', 'Niger'],
      ['NF', 'Norfolk Island'],
      ['NG', 'Nigeria'],
      ['NI', 'Nicaragua'],
      ['NL', 'Netherlands'],
      ['NO', 'Norway'],
      ['NP', 'Nepal'],
      ['NR', 'Nauru'],
      ['NU', 'Niue'],
      ['NZ', 'New Zealand'],
      ['OM', 'Oman'],
      ['PA', 'Panama'],
      ['PE', 'Peru'],
      ['PF', 'French Polynesia'],
      ['PG', 'Papua New Guinea'],
      ['PH', 'Philippines'],
      ['PK', 'Pakistan'],
      ['PL', 'Poland'],
      ['PM', 'Saint Pierre and Miquelon'],
      ['PN', 'Pitcairn'],
      ['PR', 'Puerto Rico'],
      ['PS', 'Palestinian Territory'],
      ['PT', 'Portugal'],
      ['PW', 'Palau'],
      ['PY', 'Paraguay'],
      ['QA', 'Qatar'],
      ['RE', 'Reunion'],
      ['RO', 'Romania'],
      ['RS', 'Serbia'],
      ['RU', 'Russian Federation'],
      ['RW', 'Rwanda'],
      ['SA', 'Saudi Arabia'],
      ['SB', 'Solomon Islands'],
      ['SC', 'Seychelles'],
      ['SD', 'Sudan'],
      ['SE', 'Sweden'],
      ['SG', 'Singapore'],
      ['SH', 'Saint Helena'],
      ['SI', 'Slovenia'],
      ['SJ', 'Svalbard and Jan Mayen'],
      ['SK', 'Slovakia'],
      ['SL', 'Sierra Leone'],
      ['SM', 'San Marino'],
      ['SN', 'Senegal'],
      ['SO', 'Somalia'],
      ['SR', 'Suriname'],
      ['SS', 'South Sudan'],
      ['ST', 'Sao Tome and Principe'],
      ['SV', 'El Salvador'],
      ['SX', 'Sint Maarten'],
      ['SY', 'Syrian Arab Republic'],
      ['SZ', 'Swaziland'],
      ['TC', 'Turks and Caicos Islands'],
      ['TD', 'Chad'],
      ['TF', 'French Southern Territories'],
      ['TG', 'Togo'],
      ['TH', 'Thailand'],
      ['TJ', 'Tajikistan'],
      ['TK', 'Tokelau'],
      ['TL', 'Timor-Leste'],
      ['TM', 'Turkmenistan'],
      ['TN', 'Tunisia'],
      ['TO', 'Tonga'],
      ['TR', 'Turkey'],
      ['TT', 'Trinidad and Tobago'],
      ['TV', 'Tuvalu'],
      ['TW', 'Taiwan'],
      ['TZ', 'Tanzania, United Republic of'],
      ['UA', 'Ukraine'],
      ['UG', 'Uganda'],
      ['UM', 'United States Minor Outlying Islands'],
      ['US', 'United States'],
      ['UY', 'Uruguay'],
      ['UZ', 'Uzbekistan'],
      ['VA', 'Holy See (Vatican City State)'],
      ['VC', 'Saint Vincent and the Grenadines'],
      ['VE', 'Venezuela'],
      ['VG', 'Virgin Islands, British'],
      ['VI', 'Virgin Islands, U.S.'],
      ['VN', 'Vietnam'],
      ['VU', 'Vanuatu'],
      ['WF', 'Wallis and Futuna'],
      ['WS', 'Samoa'],
      ['YE', 'Yemen'],
      ['YT', 'Mayotte'],
      ['ZA', 'South Africa'],
      ['ZM', 'Zambia'],
      ['ZW', 'Zimbabwe']
    ],

    initialize: function (cb) {
      // eslint-disable-next-line callback-return
      cb();
      sails.after('hook:sdtdLogs:ready', async function () {
        try {
          let configs = await SdtdConfig.find({
            inactive: false
          });

          for (const config of configs) {
            if (config.countryBanConfig.enabled) {
              try {
                await startCountryBan(config.server);
              } catch (error) {
                sails.log.error(
                  `Error initializing countryban for server ${config.server} - ${error}`, {serverId: config.server}
                );
              }
            }
          }

          sails.log.info(
            `HOOK: countryBan - Initialized ${countryBanInfoMap.size} country ban instances`
          );
        } catch (error) {
          sails.log.error(`HOOK:countryBan ${error}`);
        }
      });
    },

    /**
     * @name start
     * @memberof module:7dtdCountryBan
     * @description Starts countryBan for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    start: async function start(serverId) {
      sails.log.debug(
        `HOOK:countryBan Starting countryBan for server ${serverId}`, {serverId}
      );
      startCountryBan(serverId);
    },

    /**
     * @name stop
     * @memberof module:7dtdCountryBan
     * @description Stops countryBan for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    stop: async function (serverId) {
      sails.log.debug(
        `HOOK:countryBan Stopping countryBan for server ${serverId}`, {serverId}
      );

      let loggingObj = await sails.hooks.sdtdlogs.getLoggingObject(serverId);

      if (_.isUndefined(loggingObj)) {
        throw new Error('Could not find logging object for server');
      }
      loggingObj.removeListener('playerConnected', handleCountryBan);

      countryBanInfoMap.delete(String(serverId));
    },

    /**
     * @name getStatus
     * @memberof module:7dtdCountryBan
     * @description Gets the country ban status/config for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    getStatus: function (serverId) {
      sails.log.debug(
        `HOOK:countryBan Getting countryBan status for server ${serverId}`, {serverId}
      );
      return countryBanInfoMap.get(String(serverId));
    },

    getAmount: function () {
      return countryBanInfoMap.size;
    },

    /**
     * @name reload
     * @memberof module:7dtdCountryBan
     * @description Changes banned countries config for a server
     * @param {number} serverId - Id of the server
     * @method
     */

    reload: async function (serverId, newConfig) {
      try {
        sails.log.debug(
          `HOOK:countryBan Reloading country ban for server ${serverId}`, {serverId}
        );

        let config = await SdtdConfig.findOne({
          server: serverId
        });

        if (_.isUndefined(config)) {
          throw new Error('Could not find server config with specified ID');
        }

        if (_.isUndefined(newConfig)) {
          newConfig = config.countryBanConfig;
        }

        await SdtdConfig.update(
          {
            server: serverId
          },
          {
            countryBanConfig: newConfig
          }
        ).fetch();
        countryBanInfoMap.set(String(serverId), newConfig);

        await this.stop(serverId);
        return await this.start(serverId);
      } catch (error) {
        sails.log.error(`HOOK:countryBan ${error}`);
      }
    },

    handleCountryBan: handleCountryBan
  };

  async function handleCountryBan(connectedMessage) {
    let country = connectedMessage.country;
    let steamId = connectedMessage.steamId;
    let serverId = connectedMessage.server.id;

    try {
      let server = await SdtdServer.findOne(serverId);

      let player = await Player.find({
        steamId: steamId,
        server: server.id
      });
      player = player[0];

      sails.log.debug(
        `HOOK:countryBan - Player from ${country} connected to server ${server.name}, checking if needs to be kicked`,
        {player, server}
      );
      let config = await SdtdConfig.find({
        server: server.id
      });

      let countryBanConfig = config[0].countryBanConfig;
      let countryBanListMode = config[0].countryBanListMode;

      if (
        !countryBanConfig.whiteListedSteamIds.includes(steamId) && //not on whitelist AND either
        (
          (countryBanConfig.bannedCountries.includes(country) && !countryBanListMode) || //country is on the list, and in blacklist mode OR
          (!countryBanConfig.bannedCountries.includes(country) && countryBanListMode)    //country is not on list, and in whitelist mode
        )
      ) {
        await CountryBan.create({
          steamId: connectedMessage.steamId,
          country: country,
          ip: connectedMessage.ip,
          type: countryBanConfig.ban ? 'ban' : 'kick',
          server: server.id,
          player: !_.isUndefined(player) ? player.id : null
        });

        if (countryBanConfig.ban) {
          await sails.helpers.sdtdApi.executeConsoleCommand(
            {
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            },
            `ban add ${connectedMessage.entityId} 100 years "CSMM: Players from your country (${country}) are not allowed to connect to this server."`
          );
        } else {
          await sails.helpers.sdtdApi.executeConsoleCommand(
            {
              ip: server.ip,
              port: server.webPort,
              adminUser: server.authName,
              adminToken: server.authToken
            },
            `kick ${connectedMessage.entityId} "CSMM: Players from your country (${country}) are not allowed to connect to this server."`
          );
        }

        await sails.helpers.discord.sendNotification({
          serverId: server.id,
          notificationType: 'countrybanKick',
          player: connectedMessage
        });
        sails.log.info(
          `HOOK:countryBan - Kicked player ${connectedMessage.playerName} from ${country} server ${server.name}`, {server, player: connectedMessage}
        );
      }
    } catch (error) {
      sails.log.error(`HOOK:countryBan failed to handle player connnect`, {serverId});
      sails.log.error(error);
    }
  }

  async function startCountryBan(serverId) {
    try {
      let config = await SdtdConfig.findOne({
        server: serverId
      });
      currentConfig = config.countryBanConfig;

      let loggingObj = await sails.hooks.sdtdlogs.getLoggingObject(serverId);
      if (_.isUndefined(loggingObj)) {
        return sails.log.error('Could not find logging object for server', {serverId});
      }

      loggingObj.on('playerConnected', handleCountryBan);

      return countryBanInfoMap.set(String(serverId), currentConfig);
    } catch (error) {
      sails.log.error(`HOOK:countryBan ${error}`, {serverId});
      throw error;
    }
  }
};
