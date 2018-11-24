const SdtdApi = require('7daystodie-api-wrapper');

module.exports = {


  friendlyName: 'CPM get setting',


  description: 'Get a CPM setting value.',

  inputs: {

    serverId: {
      type: 'number',
      required: true,
    },

    setting: {
      type: 'string',
      required: true,
      isIn: ["prefix", "hidePrefix", "serverChatName", "announceNightTime", "locTrack", "preventFallingBlocks", "blockUTF8"]
    }

  },


  exits: {
    badRequest: {
      description: '',
      responseType: 'badRequest'
    },
  },


  fn: async function (inputs, exits) {
    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(inputs.serverId);
    const server = await SdtdServer.findOne(inputs.serverId);

    if (cpmVersion < 6.5) {
      return exits.badRequest(`You must use CPM version 6.5 or higher`);
    }

    let commandToExecute = prepareCommand(inputs.setting);
    let response;

    try {
      response = await SdtdApi.executeConsoleCommand({
        ip: server.ip,
        port: server.webPort,
        adminUser: server.authName,
        adminToken: server.authToken
      }, commandToExecute);
    } catch (error) {
      sails.log.warn(`Error executing a command for server ${server.name} while getting a CPM setting - ${error}`);
      return exits.badRequest(`Error connecting to server.`);
    }

    let settingValue = getValueFromResponse(response, inputs.setting);

    return exits.success(settingValue);

  }


};


function prepareCommand(setting) {
  switch (setting) {
    case "prefix":
      return 'cpmprefix';
    case "hidePrefix":
      return 'cpm-hidechatcommand list';
    case "serverChatName":
      return 'cpm-scn';
    case "announceNightTime":
      return 'cpm-announcenighttime';
    case "locTrack":
      return 'cpm-loctrack';
    case "preventFallingBlocks":
      return 'cpm-pfb';
    case "blockUTF8":
      return 'cpm-bun';

    default:
      break;
  }
}

function getValueFromResponse(response, setting) {
  let result = {
    enabled: undefined,
    value: undefined,
    config: {},
    type: undefined
  };

  let splitResult = [];
  let status;

  switch (setting) {
    case "prefix":
      result.type = "prefix";
      result.value = response.result.replace('Current CPM chatcommand prefix: ', "").replace('\n', '');
      break;
    case "hidePrefix":
      result.type = "hidePrefix";
      result.value = response.result.replace('Enabled prefixes: ', "").replace('\n', '');

      if (result.value === 'none') {
        result.enabled = false
      } else {
        result.enabled = true
        if (result.value.includes(',')) {
          result.value = result.value.split(',');
        } else {
          result.value = [result.value]
        }
      }
      break;
    case "serverChatName":
      result.type = "serverChatName";
      result.value = response.result.replace('Current global servername for CPM: ', "").replace('\n', '');
      break;
    case "announceNightTime":
      result.type = "announceNightTime";
      splitResult = response.result.split('\n');
      status = splitResult[0].split(':')[1].trim();
      if (status === "True") {
        result.enabled = true;
      } else {
        result.enabled = false;
      }

      result.config.bloodMoonCycle = splitResult[1].replace('Bloodmoon cycle: ', '').replace('days', '');
      result.config.warnHours = splitResult[2].replace('Warn ', '').replace(' hours before 22:00', '');
      result.config.announcer = splitResult[3].replace('Announcer name: ', '');
      result.config.nightTimeText = splitResult[4].replace('NightTime text: ', '');
      result.config.bloodDayText = splitResult[5].replace('BloodDay text: ', '');
      result.config.bloodDayTomorrowText = splitResult[6].replace('BloodDay Tomorrow text: ', '');
      result.config.counterDayText = splitResult[7].replace('CounterDay text: ', '');
      break;
    case "locTrack":
      result.type = "locTrack";
      splitResult = response.result.split('\n');
      status = splitResult[1].replace('Enabled: ', '').trim();
      if (status === "True") {
        result.enabled = true;
      } else {
        result.enabled = false;
      }

      result.config.command = splitResult[2].replace('Command: ', '');
      result.config.commandEnabled = splitResult[3].replace('CommandEnabled: ', '').trim();
      if (result.config.commandEnabled === "True") {
        result.config.commandEnabled = true;
      } else {
        result.config.commandEnabled = false;
      }
      result.config.interval = splitResult[4].replace('Interval: ', '').replace(' seconds', '');
      result.config.maxAgeData = splitResult[5].replace('MaxAgeData: ', '').replace(' hours', '');
      result.config.nearDistance = splitResult[6].replace('NearDistance: ', '').replace(' meters', '');
      result.config.responseColor = splitResult[7].replace('ResponseColor: ', '');
      break;
    case "preventFallingBlocks":
      result.type = "preventFallingBlocks";
      result.value = response.result.replace('Current logBlockCount (0 = disabled, blocks do fall): ', '');
      result.value = parseInt(result.value);

      if (result.value) {
        result.enabled = true;
      } else {
        result.enabled = false;
      }
      break;
    case "blockUTF8":
      result.type = "blockUTF8";
      result.value = response.result.replace('Blocking players with UTF-8 chars in playername enabled: ', '').trim();

      if (result.value === "True") {
        result.enabled = true;
      } else {
        result.enabled = false;
      }

      break;

    default:
      break;
  }
  return result;
}
