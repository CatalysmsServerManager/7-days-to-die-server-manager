// describe('User (model)', function() {

//       describe('#findBestStudents()', function() {
//         it('should return 5 users', function (done) {
//           User.findBestStudents()
//           .then(function(bestStudents) {

//             if (bestStudents.length !== 5) {
//               return done(new Error(
//                 'Should return exactly 5 students -- the students '+
//                 'from our test fixtures who are considered the "best".  '+
//                 'But instead, got: '+util.inspect(bestStudents, {depth:null})+''
//               ));
//             }//-•

//             return done();

//           })
//           .catch(done);
//         });
//       });

//     });

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