var assert = require('chai').assert;

describe('HELPER load-player-data @service', function () {
  it('Should load all player info when only a serverID is given', function (done) {
    return sails.helpers.loadPlayerData.with({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          if (data.players.length > 1) {
            done()
          } else {
            done(`Only found info for ${data.players.length} players`)
          }

        }
      })
  });
  xit('Should load only a single players info when a steam ID is given', function (done) {
    return sails.helpers.loadPlayerData.with({
        serverId: sails.testServer.id,
        steamId: sails.testUser.steamId
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          if (data.players.length == 1) {
            done()
          } else {
            done(new Error(`Found info for ${data.players.length} players`))
          }
        }
      })
  });
  it('Should load location data', function (done) {
    return sails.helpers.loadPlayerData.with({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          throw err
        },
        success: function (data) {
          if (data.totalPlayers == 0) {
            done('No player data to test..')
          }
          if (data.players[0].location) {
            done()
          } else {
            done('No location data found')
          }
        }
      })

  });
  it('Should load inventory data', function (done) {
    sails.helpers.loadPlayerData.with({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          throw err
        },
        success: function (data) {
          if (data.totalPlayers = 0) {
            done('No player data to test..')
          }
          if (data.players[0].inventory) {
            return done()
          } else {
            return done('No inventory data found')
          }

        }
      })
  });
  it('Should save updated info to the database', function (done) {
    sails.helpers.loadPlayerData.with({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          if (data.totalPlayers = 0) {
            done(new Error('No player data to test..'))
          }
          let playerToFind = data.players[0]
          Player.findOne({
            steamId: playerToFind.steamId,
            server: sails.testServer.id
          }).exec(function (err, foundPlayer) {
            if (err) {
              return done(err)
            }
            if (foundPlayer) {
              done()
            } else {
              done(new Error('Did not find player in database'))
            }
          })
        }
      })
  });


})
