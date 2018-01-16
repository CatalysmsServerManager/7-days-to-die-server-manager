
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
  }

  });
}
