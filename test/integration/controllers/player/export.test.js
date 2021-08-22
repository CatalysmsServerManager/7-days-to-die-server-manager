const supertest = require('supertest');
const { expect } = require('chai');

describe('API players export', function () {
  it('works :)', async function () {
    const response = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/${sails.testServer.id}/players/export`);
    expect(response.statusCode).to.be.eq(200);
  });
});

