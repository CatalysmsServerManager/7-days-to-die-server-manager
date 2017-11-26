var supertest = require('supertest');
var assert = require('assert');
var agent = supertest(sails.hooks.http.app);


xdescribe('Load server info (helper)', function() {
    describe('API POST', function() {
        it('should return ok when correct info is entered', function(done) {
            agent
                .post('/api/sdtdserver/serverinfo')
                .query({ serverId: '1' })
                .expect(200, done);
        });
        it('should return bad request when no serverId given', function(done) {
            agent
                .post('/api/sdtdserver/serverinfo')
                .query({ serverId: '1' })
                .expect(400, done);
        });
        it('should save server info to database', function(done) {
            sails.models.sdtdserver.find({ id: '1' }).exec(function(err, foundServer) {
                if (err) { throw err }
                assert(foundServer.name);
                assert(foundServer.description);
                done();
            });
        });
    });
    describe('API GET', function() {
        it('should return ok when correct info is entered', function(done) {
            agent
                .get('/api/sdtdserver/serverinfo')
                .query({ serverId: '1' })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
        it('should return bad request when no serverId given', function(done) {
            agent
                .get('/api/sdtdserver/serverinfo')
                .expect(400, done);
        });
    });
});