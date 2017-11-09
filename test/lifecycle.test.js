var sails = require('sails');


// Before running any tests...
before(function(done) {

    // Increase the Mocha timeout so that Sails has enough time to lift, even if you have a bunch of assets.
    this.timeout(10000);


    sails.lift({
        // Your sails app's configuration files will be loaded automatically,
        // but you can also specify any other special overrides here for testing purposes.


    }, async function(err) {
        if (err) { return done(err); }

        // Password = "something"
        let usersToBeCreated = [{
                username: 'npmT3stCata784',
                encryptedPassword: '$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG'
            },
            {
                username: 'npmT3stNastyH4ck3r784',
                encryptedPassword: '$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG'
            },
            {
                username: 'npmT3stbannedUser784',
                encryptedPassword: '$2a$10$b8kbwLOvUvJH3Y.37ZAwdu77K3zaFfjXAQnaym3BqpSuzDApJcbcG',
                banned: true
            }
        ];



        await User.createEach(usersToBeCreated).exec(function(err, created) {
            if (err) { return console.log('ERROR creating mock data' + err); }
            return done();
        });


    });
});

// After all tests have finished...
after(function(done) {

    // here you can clear fixtures, etc.
    // (e.g. you might want to destroy the records you created above)
    User.destroy({
        where: {
            username: { startsWith: 'npmT3st' }
        }
    }).exec(function() {
        sails.lower(done);
    });



});