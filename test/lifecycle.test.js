var sails = require('sails');
var Passwords = require('machinepack-passwords');

module.exports = {
    bootstrap: async function(done) {
        sails.lift({
            // Your sails app's configuration files will be loaded automatically,
            // but you can also specify any other special overrides here for testing purposes.

            // For example, we might want to skip the Grunt hook,
            // and disable all logs except errors and warnings:
            hooks: { grunt: false },
            log: { level: 'warn' },
            // Clean out DB before running tests
            models: { migrate: 'drop' }
        }, async function(err) {
            if (err) { return done(err); }
            // here you can load fixtures, etc.
            // (for example, you might want to create some records in the database)

            var testServer = {
                ip: process.env.CSMMTESTIP,
                webPort: process.env.CSMMTESTWEBPORT,
                telnetPort: process.env.CSMMTESTTELNETPORT,
                telnetPassword: process.env.CSMMTESTTELNETPASSWORD
            };

            try {
                // Password = "something"
                var testUser = await User.create({
                    username: 'CSMMTesterFixture',
                    encryptedPassword: "$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG",
                }).fetch();
                var testServer = await SdtdServer.create({
                    ip: '192.168.1.101',
                    telnetPort: '8081',
                    telnetPassword: 'somethingtelnet',
                    authName: 'niek',
                    authToken: 'test',
                    webPort: '8082',
                    owner: testUser.id
                }).fetch();
                sails.log.debug('Finished bootstrapping test data');
                return done();
            } catch (error) {
                sails.log.error(error);
            }

        });
    },
    teardown: function(done) {
        // here you can clear fixtures, etc.
        // (e.g. you might want to destroy the records you created above)


        sails.lower(done);

    }
}