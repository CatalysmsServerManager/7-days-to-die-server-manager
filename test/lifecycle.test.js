var sails = require('sails');
var selenium = require('selenium-standalone');

module.exports = {
    bootstrap: function(done) {

        //Install and start selenium

        selenium.install({
            // check for more recent versions of selenium here:
            // https://selenium-release.storage.googleapis.com/index.html
            version: '3.0.1',
            baseURL: 'https://selenium-release.storage.googleapis.com',
            drivers: {
                chrome: {
                    // check for more recent versions of chrome driver here:
                    // https://chromedriver.storage.googleapis.com/index.html
                    version: '2.31',
                    arch: process.arch,
                    baseURL: 'https://chromedriver.storage.googleapis.com'
                }
            },
            requestOpts: { // see https://github.com/request/request#requestoptions-callback
                timeout: 10000
            },
            logger: function(message) {
                console.log(message)
            },
            progressCb: function(totalLength, progressLength, chunkLength) {

            }
        }, function(err) {
            if (err) { return done(err); }

            selenium.start({
                version: '3.0.1',
                drivers: {
                    chrome: {
                        // check for more recent versions of chrome driver here:
                        // https://chromedriver.storage.googleapis.com/index.html
                        version: '2.31',
                        arch: process.arch,
                        baseURL: 'https://chromedriver.storage.googleapis.com'
                    }
                },
            }, function(err) {
                if (err) { return done(err); }
                sails.lift({
                    // Your sails app's configuration files will be loaded automatically,
                    // but you can also specify any other special overrides here for testing purposes.

                    // For example, we might want to skip the Grunt hook,
                    // and disable all logs except errors and warnings:
                    hooks: { grunt: false },
                    log: { level: 'warn' },

                }, function(err) {
                    if (err) { return done(err); }
                    // here you can load fixtures, etc.
                    // (for example, you might want to create some records in the database)

                    return done();
                });
            });
        });






    },
    teardown: function(done) {
        // here you can clear fixtures, etc.
        // (e.g. you might want to destroy the records you created above)

        sails.lower(done);
    }
}