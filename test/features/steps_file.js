
'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
  return actor({

    loginSteam: async function() {
      this.amOnPage('/auth/steam');
      this.fillField('username', process.env.CSMM_TEST_STEAM_USERNAME);
      this.fillField('password', process.env.CSMM_TEST_STEAM_PASSWORD);
      this.click('#imageLogin');
      this.waitForElement('.navbar', 10);
      I.see('#steam-avatar');
  },

  logout: async function() {
    this.amOnPage('/');
    this.loginSteam();
    this.amOnPage('/auth/logout');
    this.dontSee('#steam-avatar')
  },

  addTestServer: async function() {
    this.loginSteam();
    this.amOnPage('/sdtdserver/addserver');
    this.fillField('Server IP', process.env.CSMM_TEST_IP);
    this.fillField('Web port', process.env.CSMM_TEST_WEBPORT);
    this.fillField('Telnet port', process.env.CSMM_TEST_TELNETPORT);
    this.fillField('Telnet password', process.env.CSMM_TEST_TELNETPW);
    this.click('Submit');
    I.see('Dashboard');
  }

  });
}
