const supertest = require('supertest');
const { expect } = require('chai');


describe('Settings', function () {

  it('Should return okay even when server is not responding', async function () {
    // We dont mock any server API requests here, so they will always fail
    sandbox.stub(User, 'findOne').callsFake(() => sails.testUser);
    const response = await supertest(sails.hooks.http.mockApp).get('/sdtdserver/1/settings');
    console.log(response.body);
    expect(response.statusCode).to.equal(200);
  });
});

