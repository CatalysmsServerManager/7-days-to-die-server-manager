'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({

        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.


        testServer: {
            ip: '192.168.1.101',
            webPort: '8082',
            telnetPort: '8081',
            telnetPassword: "somethingtelnet"
        },

        login: function(username, password) {
            this.amOnPage('/login');
            this.fillField('username', username);
            this.fillField('password', password);
            this.click('Submit');
        },

        addTestServer: function() {
            this.amOnPage('/sdtdserver/addserver');
            this.fillField('serverip', this.testServer.ip);
            this.fillField('telnetport', this.testServer.telnetPort);
            this.fillField('telnetpassword', this.testServer.telnetPassword);
            this.fillField('webport', this.testServer.webPort);
            this.click('Submit');
        },

        goToTestServerDashboard: function() {
            this.amOnPage('/welcome');
            this.click(this.testServer.ip, '.list-block');
        },

        goToTestServerConsole: function() {
            this.goToTestServerDashboard();
            this.click('Console');
        }

    });
}