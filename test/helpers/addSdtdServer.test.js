var assert = require('chai').assert;

describe('HELPER add-7dtd-server @service', function () {
  it('Should return success if correct info given', function (done) {
    return sails.helpers.add7DtdServer.with({
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
        done()
      }
    })
  });
});

