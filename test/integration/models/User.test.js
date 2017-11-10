var supertest = require('supertest');


describe('User (model)', function() {



  describe('#login() and log out', function() {
    it('should return ok', function(done) {
      var agent = supertest(sails.hooks.http.app);
      agent
        .post('/login')
        .send({ username: 'npmT3stCata784', password: 'something' })
        .expect(200, done);
    });
  });


});
