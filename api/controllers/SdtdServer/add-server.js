const sevenDays = require('machinepack-7daystodiewebapi');

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
      required: true,
    },

    authName: {
      type: 'string',
      required: true
    },
    authToken: {
      type: 'string',
      required: true
    },

    serverName: {
      type: 'string',
      required: true
    }

  },

  exits: {

    success: {
      description: 'Server was added successfully',
    },
    serverExists: {
      description: 'Server with inputted data was found in the system!',
      responseType: 'badRequest',
      statusCode: 400
    },
    cantConnect: {
      description: 'Cant connect to the server',
      responseType: 'badRequest',
      statusCode: 400
    },

    maxServers: {
      description: "User has added max amount of servers already",
      responseType: 'badRequest',
      statusCode: 400
    }

  },

  fn: async function (inputs, exits) {

    let userProfile = await User.findOne(this.req.session.userId).populate('servers');
    let donatorRole = await sails.helpers.meta.checkDonatorStatus.with({ userId: userProfile.id });
    let maxServers = sails.config.custom.donorConfig[donatorRole].maxServers;

    let sdtdServer = {
      ip: inputs.serverIp,
      webPort: inputs.webPort,
      authName: inputs.authName,
      authToken: inputs.authToken,
      name: inputs.serverName,
      owner: userProfile.id
    }

    if (userProfile.servers) {
      if (userProfile.servers.length >= maxServers) {
        return exits.maxServers("maxServers")
      }
      
    }

    let serverCheck = await checkServerResponse(sdtdServer);
    let existsCheck = await checkIfServerExists(sdtdServer);


    if (!serverCheck) {
      return exits.cantConnect("cantConnect");
    }

    if (existsCheck) {
      return exits.serverExists("serverExists");
    }


    let addedServer = await addServerToDb(sdtdServer);

    if (addedServer) {
      await sails.hooks.historicalinfo.start(addedServer.id, 'memUpdate');
      sails.log.warn(`${userProfile.username} added a new server - ${addedServer.name}`)
      return exits.success(addedServer);
    }
  }


};

async function checkServerResponse(sdtdServer) {

  let statsResponse = await checkStats(sdtdServer);
  let commandResponse = await checkCommand(sdtdServer);

  if (statsResponse && commandResponse) {
    return true
  } else {
    return false
  }

  async function checkStats(sdtdServer) {
    return new Promise(resolve => {
      let statsResponse = sevenDays.getStats({
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        authName: sdtdServer.authName,
        authToken: sdtdServer.authToken
      }).exec({
        success: (response) => {
          if (response.gametime) {
            resolve(true);
          } else {
            resolve(false)
          }
        },
        error: (error) => {
          resolve(false);
        },
        connectionRefused: error => {
          resolve(false);
        }
      });
    })
  }

  async function checkCommand(sdtdServer) {
    return new Promise(resolve => {
      let statsResponse = sevenDays.executeCommand({
        ip: sdtdServer.ip,
        port: sdtdServer.webPort,
        authName: sdtdServer.authName,
        authToken: sdtdServer.authToken,
        command: 'mem'
      }).exec({
        success: (response) => {
          resolve(true);
        },
        error: (error) => {
          resolve(false);
        },
        connectionRefused: error => {
          resolve(false)
        }
      });
    });
  }

}

async function checkIfServerExists(sdtdServerToAdd) {
  let existingServers = await SdtdServer.find({
    ip: sdtdServerToAdd.ip,
    webPort: sdtdServerToAdd.webPort
  })

  if (existingServers && existingServers.length > 0) {
    return true
  } else {
    return false
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

  let createdConfig = await SdtdConfig.create({
    server: createdServer.id
  });
  await sails.hooks.sdtdlogs.start(createdServer.id);
  return createdServer
}