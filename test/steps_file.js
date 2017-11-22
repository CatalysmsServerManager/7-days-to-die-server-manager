'use strict';
// in this file you can append custom step methods to 'I' object

module.exports = function() {
    return actor({

        // Define custom steps here, use 'this' to access default methods of I.
        // It is recommended to place a general 'login' function here.

        login: function(username, password) {
            this.amOnPage('/login');
            this.fillField('username', username);
            this.fillField('password', password);
            this.click('Submit');
        }
    });
}