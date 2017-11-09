var supertest = require('supertest');


describe('User (model)', function() {
    var agent;
    before(function(done) {
        agent = supertest(sails.hooks.http.app);
        agent
            .post('/login')
            .send({ username: 'npmT3stCata784', password: 'something' })
            .expect(200)
            .end(function(err, res) {
                if (err) { return done(err); }
                done();
            });
    });


    describe('#logout()', function() {
        it('Should return ok', function(done) {
            agent
                .post('/logout')
                .expect(200, done);
        });

    })
});