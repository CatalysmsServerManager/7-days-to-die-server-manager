const supertest = require('supertest');

describe('SetInventoryTracking', function () {
  it('under 26 should report an error', async function () {
    sandbox.stub(sails.helpers.sdtd, 'checkModVersion').callsFake(async () => 1);
    const response = await supertest(sails.hooks.http.mockApp).post('/api/sdtdserver/tracking/inventory').send({
      serverId: sails.testServer.id,
      newStatus: true
    });
    expect(response.body).to.eql('You must run Allocs webmap version greater than (or equal) 26!');
    expect(response.statusCode).to.eql(400);
  });
  it('version 26 and above should be happy', async function () {
    sandbox.stub(sails.helpers.sdtd, 'checkModVersion').callsFake(async () => 26);
    const response = await supertest(sails.hooks.http.mockApp).post('/api/sdtdserver/tracking/inventory').send({
      serverId: sails.testServer.id,
      newStatus: true
    });
    expect(response.text).to.eql('OK');
    expect(response.statusCode).to.eql(200);
  });
});


