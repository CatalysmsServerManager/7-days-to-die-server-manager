const SdtdApi = require('7daystodie-api-wrapper');

module.exports = {


  friendlyName: 'CPM set setting',


  description: '',

  inputs: {

    serverId: {
      type: 'number',
      required: true,
    },

    setting: {
      type: 'string',
      required: true,
      isIn: ["prefix", "hidePrefix", "serverChatName", "maxMessageLength", "announceNightTime", "locTrack", "preventFallingBlocks", "blockUTF8"]
    },

    value: {
      type: 'string',
      required: true
    },

    settingField: {
      type: 'string'
    }

  },


  exits: {

  },


  fn: async function (inputs, exits) {

    const cpmVersion = await sails.helpers.sdtd.checkCpmVersion(inputs.serverId);
    const server = await SdtdServer.findOne(inputs.serverId);

    if (cpmVersion < 6.5) {
      return exits.badRequest(`You must use CPM version 6.5 or higher`);
    }

    let cmdToExecute = prepareCommand(inputs.setting, inputs.value, inputs.settingField);
    let response;

    try {
      response = await SdtdApi.executeConsoleCommand({
        ip: server.ip,
        port: server.webPort,
        adminUser: server.authName,
        adminToken: server.authToken
      }, cmdToExecute);
    } catch (error) {
      sails.log.warn(`Error executing a command for server ${server.name} while setting a CPM setting - ${error}`);
      return exits.badRequest(`Error connecting to server.`);
    }
    return exits.success(response.result);
  }
};

function prepareCommand(type, value, settingField) {
  switch (type) {
    case "prefix":
      return `cpmprefix ${value}`;
    case "hidePrefix":
      return `cpm-hidechatcommand ${value}`;
    case "serverChatName":
      return `cpm-scn ${value}`;
    case "announceNightTime":
      if (settingField === "enabled") {
        return `cpm-announcenighttime ${value}`;
      }
      return `cpm-announcenighttime ${settingField} "${value}"`;
    case "locTrack":
      return `cpm-loctrack ${settingField} "${value}"`;
    case "preventFallingBlocks":
      return `cpm-pfb ${value}`;
    case "blockUTF8":
      return `cpm-bun ${value}`;

    default:
      break;
  }
}
