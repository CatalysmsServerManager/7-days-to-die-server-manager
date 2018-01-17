describe('Helpers', function () {
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
    this.timeout(10000)
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
      this.timeout(50000)
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
  });

  describe('add-7dtd-server', function () {
    // Dealing with unresponsive servers, so we allow longer timeouts here
    this.timeout(10000)
    before(async function () {
      this.timeout(5000)
      try {
        let deletedRecords = await SdtdServer.destroy({})
        return
      } catch (error) {
        return error
      }

      beforeEach(async function () {
        sails.testServer = {
          ip: process.env.CSMM_TEST_IP,
          telnetPort: process.env.CSMM_TEST_TELNETPORT,
          telnetPassword: process.env.CSMM_TEST_TELNETPW,
          webPort: process.env.CSMM_TEST_WEBPORT,
        }
      })

    })
    after(async function () {
      try {
        let testServer = await SdtdServer.create({
          ip: process.env.CSMM_TEST_IP,
          telnetPort: process.env.CSMM_TEST_TELNETPORT,
          webPort: process.env.CSMM_TEST_WEBPORT,
          authName: process.env.CSMM_TEST_AUTHNAME,
          authToken: process.env.CSMM_TEST_AUTHTOKEN,
          owner: sails.testUser.id
        }).fetch()
        testServer.telnetPassword = process.env.CSMM_TEST_TELNETPW
        sails.testServer = testServer
        return
      } catch (error) {
        return error
      }


    })

    it('Returns OK with valid data', function (done) {
      sails.helpers.add7DtdServer.with({
        ip: sails.testServer.ip,
        telnetPort: sails.testServer.telnetPort,
        telnetPassword: sails.testServer.telnetPassword,
        webPort: sails.testServer.webPort,
        owner: sails.testUser.id
      }).switch({
        error: function (err) {
          done(err);
        },
        success: function (data) {
          done();
        }
      });
    })
    it('Returns badWebPort if invalid webport given', function (done) {
      this.timeout(15000)
      sails.helpers.add7DtdServer.with({
        ip: sails.testServer.ip,
        telnetPort: sails.testServer.telnetPort,
        telnetPassword: sails.testServer.telnetPassword,
        webPort: sails.testServer.webPort + 1,
        owner: sails.testUser.id
      }).switch({
        error: function (err) {
          done(err);
        },
        badWebPort: function (error) {
          done()
        },
        success: function (data) {
          done(new Error('Success but should have errored'));
        }
      });
    });
    it('Returns badTelnet if invalid telnet info given', function (done) {
      sails.helpers.add7DtdServer.with({
        ip: sails.testServer.ip,
        telnetPort: sails.testServer.telnetPort,
        telnetPassword: "WRONGPASSWORD",
        webPort: sails.testServer.webPort,
        owner: sails.testUser.id
      }).switch({
        error: function (err) {
          done();
        },
        badTelnet: function (error) {
          done()
        },
        success: function (data) {
          done(new Error('Success but should have errored'));
        }
      });
    })

  });
  describe('load-sdtdServer-info', function () {
    it('Returns OK with a valid serverId', function (done) {
      sails.helpers.loadSdtdserverInfo(sails.testServer.id).switch({
        success: (data) => {
          done()
        },
        error: (err) => done(err)
      })
    })
    it('Errors with an invalid serverId', function (done) {
      sails.helpers.loadSdtdserverInfo('notanId').switch({
        success: (data) => {
          done(new Error('Success but should have errored'))
        },
        error: (err) => done()
      })
    })
    it('Returns stats & serverInfo data', function (done) {
      sails.helpers.loadSdtdserverInfo(sails.testServer.id).switch({
        success: (data) => {
          if (!_.isUndefined(data.stats) && !_.isUndefined(data.serverInfo)) {
            done()
          } else {
            done(new Error('Did not find expected info in response'))
          }
        },
        error: (err) => done(err)
      })

    })
  })
})
