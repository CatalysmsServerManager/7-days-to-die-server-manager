const sevenDaysAPI = require('7daystodie-api-wrapper');

module.exports = {
  friendlyName: 'Add server',

  description: '',

  inputs: {
    serverIp: {
      description: 'Ip of the SdtdServer',
      type: 'string',
      required: true
    },

    webPort: {
      type: 'number',
      required: true
    },

    authName: {
      type: 'string',
      minLength: 2,
      maxLength: 200,
      required: true
    },

    authToken: {
      type: 'string',
      minLength: 10,
      maxLength: 200,
      required: true
    },

    serverName: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      description: 'Server was added successfully'
    },

    badRequest: {
      description: 'User did a bad thing :D',
      responseType: 'badRequest',
      statusCode: 400
    }
  },

  fn: async function (inputs, exits) {
    let user = await User.findOne(this.req.session.userId).populate(
      'servers'
    );
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({
      userId: user.id
    });
    let maxServers = sails.config.custom.donorConfig[donatorRole].maxServers;

    let sdtdServer = {
      ip: inputs.serverIp,
      webPort: inputs.webPort,
      authName: inputs.authName,
      authToken: inputs.authToken,
      name: inputs.serverName,
      owner: user.id
    };

    let errorResponse = {
      connectCheck: false,
      statsResponse: false,
      commandResponse: false,
      duplicateCheck: false,
      maxLimitCheck: false,
      detectedControlPanelPortUsed: false,
      private: false,
      donors: false,
    };

    errorResponse.private = !privateCheck(user);
    errorResponse.donors = !donorCheck(donatorRole);

    if (errorResponse.private) {
      return exits.badRequest(errorResponse);
    }

    if (errorResponse.donors) {
      return exits.badRequest(errorResponse);
    }


    let existsCheck = await checkIfServerExists(sdtdServer);

    if (existsCheck) {
      sails.log.info(
        `${user.username} tried to add a new server - ${sdtdServer.name} - but it is duplicate`, {user}
      );
      errorResponse.duplicateCheck = true;
      return exits.badRequest(errorResponse);
    }

    if (user.servers) {
      if (user.servers.length >= maxServers) {
        sails.log.info(
          `${user.username} tried to add a new server - ${sdtdServer.name} - Max server limit (${maxServers}) reached!`, {user}
        );
        errorResponse.maxLimitCheck = true;
        return exits.badRequest(errorResponse);
      }
    }

    let serverCheck = await checkServerResponse(sdtdServer);

    if (!serverCheck.statsResponse || !serverCheck.memResponse) {
      sails.log.info(
        `${user.username} tried to add a new server - ${sdtdServer.name} - but cannot connect - ${sdtdServer.ip}:${sdtdServer.webPort}`, {user}
      );
      errorResponse.statsResponse = serverCheck.statsResponse;
      errorResponse.commandResponse = serverCheck.memResponse;
      errorResponse.connectCheck = true;
      if (serverCheck.detectedControlPanelPortUsed) {
        errorResponse.detectedControlPanelPortUsed =
          serverCheck.detectedControlPanelPortUsed;
      }
      return exits.badRequest(errorResponse);
    }

    let addedServer = await addServerToDb(sdtdServer);

    if (addedServer) {
      sails.log.warn(
        `${user.username} added a new server - ${addedServer.name}`, {user, server: addedServer}
      );
      await sails.helpers.sdtd.loadAllPlayerData(addedServer.id);
      errorResponse.server = addedServer;

      // Create some default roles
      let adminRole = await Role.create({
        server: addedServer.id,
        name: 'Admin',
        level: '1',
        manageServer: true
      }).fetch();

      await Role.create({
        server: addedServer.id,
        name: 'Moderator',
        level: '10',
        manageEconomy: true,
        managePlayers: true,
        manageTickets: true,
        viewAnalytics: true,
        viewDashboard: true,
        useTracking: true,
        useChat: true,
        manageGbl: true,
        discordLookup: true
      });

      await Role.create({
        server: addedServer.id,
        name: 'Donator',
        level: '1000',
        economyGiveMultiplier: 1.25,
        amountOfTeleports: 5
      });

      await Role.create({
        server: addedServer.id,
        name: 'Player',
        level: '2000',
        amountOfTeleports: 2
      });

      // Add server owner to admins group
      let ownerPlayerProfile = await Player.findOne({
        server: addedServer.id,
        steamId: user.steamId
      });

      if (ownerPlayerProfile) {
        await Player.update(
          {
            id: ownerPlayerProfile.id
          },
          {
            role: adminRole.id
          }
        );
      }

      await sails.hooks.sdtdlogs.start(addedServer.id);
      await sails.hooks.sdtdlogs.createLogObject(addedServer.id);

      return exits.success(errorResponse);
    } else {
      return exits.error(errorResponse);
    }
  },

  privateCheck: privateCheck,
  donorCheck: donorCheck,
};

async function checkServerResponse(sdtdServer) {
  let statsResponse = await checkStats(sdtdServer);
  let commandResponse = await checkCommand(sdtdServer);

  let responseObj = {
    statsResponse: statsResponse,
    memResponse: commandResponse,
    detectedControlPanelPortUsed: false
  };

  if (!statsResponse.gametime) {
    if (String(statsResponse).startsWith('<html>')) {
      responseObj.detectedControlPanelPortUsed = true;
    }
    responseObj.statsResponse = false;
  }

  return responseObj;
}

async function checkStats(sdtdServer) {
  try {
    let response = await sevenDaysAPI.getStats(
      {
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        adminUser: sdtdServer.authName,
        adminToken: sdtdServer.authToken
      },
      { timeout: 10000 }
    );
    return response;
  } catch (error) {
    sails.log.warn(error);
    return false;
  }
}

async function checkCommand(sdtdServer) {
  try {
    let response = await sevenDaysAPI.executeConsoleCommand(
      {
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        adminUser: sdtdServer.authName,
        adminToken: sdtdServer.authToken
      },
      'version',
      { timeout: 10000 }
    );
    return response;
  } catch (error) {
    sails.log.warn(error);
    return false;
  }
}

async function checkIfServerExists(sdtdServerToAdd) {
  let existingServers = await SdtdServer.find({
    ip: sdtdServerToAdd.ip,
    webPort: sdtdServerToAdd.webPort
  });

  if (existingServers && existingServers.length > 0) {
    return true;
  } else {
    return false;
  }
}

async function addServerToDb(sdtdServerToAdd) {
  let createdServer = await SdtdServer.create({
    ip: sdtdServerToAdd.ip,
    webPort: sdtdServerToAdd.webPort,
    authName: sdtdServerToAdd.authName,
    authToken: sdtdServerToAdd.authToken,
    name: sdtdServerToAdd.name,
    owner: sdtdServerToAdd.owner
  }).fetch();

  await SdtdConfig.create({
    server: createdServer.id
  });
  return createdServer;
}


function privateCheck(user) {
  const isPrivateInstance = (process.env.CSMM_PRIVATE_INSTANCE === 'true');

  return !isPrivateInstance || sails.config.custom.adminSteamIds.includes(user.steamId);
}

function donorCheck(donorLevel) {
  const isDonorInstance = (process.env.CSMM_DONOR_ONLY === 'true');

  return !isDonorInstance || (donorLevel !== 'free');
}
