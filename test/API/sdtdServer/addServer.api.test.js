var supertest = require('supertest');

describe('POST /api/sdtdserver/addserver @api', function() {
    it('Should return ok with correct info', function(done) {
        supertest(sails.hooks.http.app)
        .post('/api/sdtdserver/addserver')
    });
})
