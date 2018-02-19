'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function () {
  return actor({

    loginSteam: async function () {
      this.amOnPage('/auth/steam');
      if (this.see('username')) {
        this.fillField('username', process.env.CSMM_TEST_STEAM_USERNAME);
        this.fillField('password', process.env.CSMM_TEST_STEAM_PASSWORD);
      }
      this.click('#imageLogin');
      this.waitForElement('.navbar', 10);
      I.see('#steam-avatar');
    },

    logout: async function () {
      this.amOnPage('/');
      this.loginSteam();
      this.amOnPage('/auth/logout');
      this.dontSee('#steam-avatar')
    },

    addTestServer: async function () {
      this.amOnPage('/sdtdserver/addserver');
      this.fillField('Name', process.env.CSMM_TEST_SERVERNAME);
      this.fillField('Server IP', process.env.CSMM_TEST_IP);
      this.fillField('Web API port', process.env.CSMM_TEST_WEBPORT);
      this.fillField('Telnet port', process.env.CSMM_TEST_TELNETPORT);
      this.fillField('Telnet password', process.env.CSMM_TEST_TELNETPW);
      this.click('Submit');
      this.waitForElement('#dashboard-title', 10);
    },

    // Assumes you are on dashboard already !
    deleteTestServer: async function () {
      this.scrollPageToTop();
      this.waitForElement("#delete-server-button", 10);
      this.click("#delete-server-button");
    }

  });
}
