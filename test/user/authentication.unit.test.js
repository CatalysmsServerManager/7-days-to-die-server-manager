var supertest = require('supertest');
var assert = require('assert');
var agent = supertest(sails.hooks.http.app);


describe('User (model)', function() {
    describe('login()', function() {
        it('should return ok when correct info is entered', function(done) {
            agent
                .post('/login')
                .send({ username: 'CSMMTesterFixture', password: 'something' })
                .expect(200, done);
        });
        it('should allow access to sdtd functions when a user is logged in', function(done) {
            agent
                .get('/sdtdserver/addserver')
                .expect(200, done);
        });
    });



    describe('register()', function() {
        it('should return ok', function(done) {
            var agent = supertest(sails.hooks.http.app);
            agent
                .post('/register')
                .send({ username: 'newUser', password: 'newSecret' })
                .expect(200, done);
        });
        it('should be saved to DB', function(done) {
            sails.models.user.findOne({ username: 'newUser' }).exec(function(err, foundUser) {
                if (err) { throw err }
                assert.equal(foundUser.username, 'newUser');
                done();
            });
        });
    });
});