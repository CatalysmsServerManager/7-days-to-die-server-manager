var supertest = require('supertest');

describe('User (model)', function() {

    describe('#login()', function() {
        it('Should return ok', function(done) {
            supertest(sails.hooks.http.app)
                .post('/login')
                .send({ username: 'npmT3stCata784', password: 'something' })
                .expect(200, done)
        });
    });

    // describe('#logout()', function() {
    //     it('Should return ok', function(done) {
    //         supertest(sails.hooks.http.app)
    //             .post('/logout')
    //             .expect(200, done)
    //     });

    // })
});