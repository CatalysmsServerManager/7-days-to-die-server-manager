var sails = require('sails');
var Passwords = require('machinepack-passwords');

module.exports = {
    bootstrap: function(done) {
        sails.lift({
            // Your sails app's configuration files will be loaded automatically,
            // but you can also specify any other special overrides here for testing purposes.

            // For example, we might want to skip the Grunt hook,
            // and disable all logs except errors and warnings:
            hooks: { grunt: false },
            log: { level: 'warn' },
            // Clean out DB before running tests
            models: { migrate: 'drop' }
        }, function(err) {
            if (err) { return done(err); }
            // here you can load fixtures, etc.
            // (for example, you might want to create some records in the database)

            // Password = "something"
            User.create({
                username: 'CSMMTesterFixture',
                encryptedPassword: "$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG",
            }).exec(function() {
                sails.log.debug('Finished bootstrapping test data');
                return done();
            });
        });
    },
    teardown: function(done) {
        // here you can clear fixtures, etc.
        // (e.g. you might want to destroy the records you created above)


        sails.lower(done);

    }
}