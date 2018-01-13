describe('helpers', function () {
  describe('load-player-data', function () {
    it('Should load all player info when only a serverID is given', function (done) {
      return sails.helpers.loadPlayerData.with({
          serverId: sails.testServer.id
        })
        .switch({
          error: function (err) {
            return done(err);
          },
          success: function (data) {
            if (data.players.length > 1) {
              return done();
            } else {
              return done(`Only found info for ${data.players.length} players`);
            }

          }
        });
    });
    it('Should load location data', function (done) {
      return sails.helpers.loadPlayerData.with({
          serverId: sails.testServer.id
        })
        .switch({
          error: function (err) {
            throw err;
          },
          success: function (data) {
            if (data.totalPlayers === 0) {
              return done('No player data to test..');
            }
            if (data.players[0].location) {
              return done();
            } else {
              return done('No location data found');
            }
          }
        });

    });

    it('Should save updated info to the database', function (done) {
      sails.helpers.loadPlayerData.with({
          serverId: sails.testServer.id
        })
        .switch({
          error: function (err) {
            return done(err);
          },
          success: function (data) {
            if (data.totalPlayers = 0) {
              return done(new Error('No player data to test..'));
            }
            let playerToFind = data.players[0];
            Player.findOne({
              steamId: playerToFind.steamId,
              server: sails.testServer.id
            }).exec(function (err, foundPlayer) {
              if (err) {
                return done(err);
              }
              if (foundPlayer) {
                return done();
              } else {
                return done(new Error('Did not find player in database'));
              }
            });
          }
        });
    });


  });

  describe('check-if-available', function () {
    // Since we're dealing with unresponsive servers, we'll need to heighten the timeout
    this.timeout(5000)
    before(async function () {
      this.timeout(5000)
      try {
        sails.serverWithBadWebPort = await SdtdServer.create({
          ip: process.env.CSMM_TEST_IP,
          telnetPort: process.env.CSMM_TEST_TELNETPORT,
          telnetPassword: process.env.CSMM_TEST_TELNETPW,
          webPort: '1111',
          owner: sails.testUser.id,
        }).fetch()
        sails.serverWithBadAuthInfo = await SdtdServer.create({
          ip: process.env.CSMM_TEST_IP,
          telnetPort: process.env.CSMM_TEST_TELNETPORT,
          telnetPassword: process.env.CSMM_TEST_TELNETPW,
          authName: process.env.CSMM_TEST_AUTHNAME,
          authToken: process.env.CSMM_TEST_AUTHTOKEN + 'FALSEINFO',
          webPort: process.env.CSMM_TEST_WEBPORT,
          owner: sails.testUser.id,
        }).fetch()
        return

      } catch (error) {
        return error
      }

    })
    it('Should return ok with valid info', function (done) {
      sails.helpers.sdtd.checkIfAvailable(sails.testServer.id).switch({
        success: () => {
          done()
        },
        notAvailable: (error) => {
          done(error)
        },
        error: (error) => {
          done(error)
        }
      })


    })
    it('Should return notAvailable with bad webPort', function (done) {
      sails.helpers.sdtd.checkIfAvailable(sails.serverWithBadWebPort.id).switch({
        success: () => {
          done(new Error(`Success but should have errored`))
        },
        notAvailable: (error) => {
          done()
        },
        error: (error) => {
          done(error)
        }
      })
    })
    it('Should return notAvailable with bad authInfo', function (done) {
      sails.helpers.sdtd.checkIfAvailable(sails.serverWithBadAuthInfo.id).switch({
        success: () => {
          done(new Error(`Success but should have errored`))
        },
        notAvailable: (error) => {
          done()
        },
        error: (error) => {
          done(error)
        }
      })
    })
  })
})
