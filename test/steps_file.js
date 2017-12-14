'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({

        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.

        login: function(username, password) {
            this.amOnPage('/auth/steam');
            this.fillField('username', process.env.CSMM_TEST_STEAM_USERNAME);
            this.fillField('password', process.env.CSMM_TEST_STEAM_PASSWORD);
            this.click('#imageLogin');
        },

        addTestServer: async function() {
            this.amOnPage('/sdtdserver/addserver');
            this.fillField('serverip', sails.testServer.ip);
            this.fillField('telnetport', sails.testServer.telnetPort);
            this.fillField('telnetpassword', sails.testServer.telnetPassword);
            this.fillField('webport', sails.testServer.webPort);
            await this.click('Submit');
        },

        goToTestServerDashboard: function() {
            this.amOnPage('/welcome');
            let testServerIP = sails.testServer.ip;
            this.click(testServerIP, '.list-block');
        },

        goToTestServerConsole: function() {
            this.goToTestServerDashboard();
            this.click('Console');
        },

        findTestServerFromDB: function() {
            return SdtdServer.find({
                ip: sails.testServer.ip,
                webPort: sails.testServer.webPort
            }).limit(1).then(function(foundServer) {
                sails.testServer = foundServer[0]
            }).catch(function(error) {
                throw error
            });
        },
    });
}