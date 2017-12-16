var assert = require('assert');

describe('HELPER load-player-data @service', function () {
  it('Should load all player info when only a serverID is given', function (done) {
    return sails.helpers.loadPlayerData({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          assert((data.totalPlayers > 1))
          done();
        }
      })
  });
  it('Should load only a single players info when a player ID is given', function (done) {
    return sails.helpers.loadPlayerData({
        serverId: sails.testServer.id,
        steamId: sails.testUser.steamId
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          assert((data.totalPlayers == 1))
          done();
        }
      })
  });
  it('Should load location data', function (done) {
    return sails.helpers.loadPlayerData({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          if (data.totalPlayers == 0) {
            done(new Error('No player data to test..'))
          }
          if (data.players[0].location) {
            done()
          } else {
            done(new Error("No location info"))
          }

        }
      })
  });
  it('Should load inventory data', function (done) {
    sails.helpers.loadPlayerData({
        serverId: sails.testServer.id
      })
      .switch({
        error: function (err) {
          done(err)
        },
        success: function (data) {
          if (data.totalPlayers = 0) {
            return done(new Error('No player data to test..'))
          }
          console.log(data.players)
          if (data.players[0].inventory) {
            done()
          } else {
            done(new Error("No inventory info"))
          }
        }
      })
  });
  it('Should save updated info to the database', function (done) {
    sails.helpers.loadPlayerData({
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
