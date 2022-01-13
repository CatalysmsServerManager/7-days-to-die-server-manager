const { expect } = require('chai');
const supertest = require('supertest');


describe('POST /api/playground/execute', () => {

  it('Is succesful with correct params', async () => {
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/playground/execute')
      .send({
        template: 'test',
        data: {
          test: 'test'
        },
        serverId: sails.testServer.id
      });

    expect(response.status).to.be.eq(200);
    expect(response.body.errors).to.have.lengthOf(0);
  });


  it('Does not allow overriding the server object via data', async () => {
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/playground/execute')
      .send({
        template: '{{ server.id }}',
        data: {
          server: {
            id: 'test'
          }
        },
        serverId: sails.testServer.id
      });

    expect(response.body.output[0]).to.be.eq(sails.testServer.id.toString());


  });
});
