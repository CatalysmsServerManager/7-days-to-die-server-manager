var sevenDays = require('machinepack-7daystodiewebapi');

module.exports = {


  friendlyName: 'Load player data',


  description: '',


  inputs: {
    serverID: {
      type: 'number'
    },

  },


  exits: {

    noPlayers: {
      description: 'No player data on the server.'
    }

  },


  fn: async function(inputs, exits) {

    await sails.models.sdtdserver.findOne(inputs.serverID).exec(async function(err, foundServer) {
      if (err) {return exits.error('load-player-data database error' + err);}
      await sevenDays.getPlayerList({
        ip: foundServer.ip,
        port: foundServer.webPort,
        authName: foundServer.authName,
        authToken: foundServer.authToken
      }).exec({
        error: function(err) {
          console.log(err);
        },
        success: function(data) {
          const playerData = data.players;
          if (_.isUndefined(playerData)) { return exits.noPlayers(); }
          playerData.forEach(async function(playerJSON) {
            await sails.models.player.find({
              where: {
                steamID: playerJSON.steamid,
                entityID: playerJSON.entityid
              }
            }).exec(async function(err, foundPlayer) {
              if (err) { return console.log(`ERROR finding player ${err}`); }

              // Player was already in our database, updating data
              if (foundPlayer.id) {
                try {
                  await Player.update({ id: foundPlayer.id })
                    .set({
                      ip: playerJSON.ip,
                      positionX: playerJSON.position.x,
                      positionY: playerJSON.position.y,
                      positionZ: playerJSON.position.z,
                      playtime: playerJSON.totalplaytime,
                      lastOnline: playerJSON.lastonline,
                      banned: playerJSON.banned
                    });
                } catch (error) {
                  sails.log(`Error updating player: ${error}`);
                }

              }

              // Player not in database, creating a new record
              if (_.isUndefined(foundPlayer.id)) {
                try {
                  await Player.create({
                    steamID: playerJSON.steamid,
                    entityID: playerJSON.entityid,
                    ip: playerJSON.ip,
                    name: playerJSON.name,
                    positionX: playerJSON.position.x,
                    positionY: playerJSON.position.y,
                    positionZ: playerJSON.position.z,
                    playtime: playerJSON.totalplaytime,
                    lastOnline: playerJSON.lastonline,
                    banned: playerJSON.banned,
                    server: inputs.serverID
                  });
                } catch (error) {
                  sails.log(`Error creating player: ${error}`);
                }

              }

              // All done.
              return exits.success();
            });
          });

        }
      });

    });

  }


};
