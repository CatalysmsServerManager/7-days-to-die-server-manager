const supertest = require('supertest');
const { expect } = require('chai');


describe('set-settings', function () {
  describe('Reply type', function () {
    it('Should set the replyType', async function () {
      const response = await supertest(sails.hooks.http.mockApp).post('/api/sdtdserver/settings').send({ replyPrefix: 'blabla', serverId: sails.testServer.id });
      expect(response.statusCode).to.equal(200);
      const config = await SdtdConfig.findOne({ server: sails.testServer.id });
      expect(config.replyPrefix).to.be.equal('blabla');
    });
    it('Should set the replyServerName', async function () {
      const response = await supertest(sails.hooks.http.mockApp).post('/api/sdtdserver/settings').send({ replyServerName: 'replyServerName', serverId: sails.testServer.id });
      expect(response.statusCode).to.equal(200);
      const config = await SdtdConfig.findOne({ server: sails.testServer.id });
      expect(config.replyServerName).to.be.equal('replyServerName');
    });
    it('Should allow empty strings to be set', async function () {
      const response = await supertest(sails.hooks.http.mockApp).post('/api/sdtdserver/settings').send({ replyPrefix: '', serverId: sails.testServer.id });
      expect(response.statusCode).to.equal(200);
      const config = await SdtdConfig.findOne({ server: sails.testServer.id });
      expect(config.replyPrefix).to.be.equal('');
    });
  });
});

