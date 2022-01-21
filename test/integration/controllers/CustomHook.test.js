const { expect } = require('chai');
const supertest = require('supertest');

describe('CustomHook API CRUD', () => {
  describe('POST /api/sdtdserver/hook', () => {

    it('Saves a hook', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/sdtdserver/hook')
        .send({
          serverId: sails.testServer.id,
          commandsToExecute: 'test',
          event: 'logLine',
          searchString: 'testttt',
        });

      expect(response.status).to.be.equal(200);
      const hook = await CustomHook.findOne(response.body.id);
      expect(hook.commandsToExecute).to.be.equal('test');
      expect(hook.event).to.be.equal('logLine');
      expect(hook.searchString).to.be.equal('testttt');
    });

    it('Does not escape regex control characters', async () => {
      const response = await supertest(sails.hooks.http.mockApp)
        .post('/api/sdtdserver/hook')
        .send({
          serverId: sails.testServer.id,
          commandsToExecute: 'test',
          event: 'logLine',
          regex: `\[[a-fA-F0-8]{6}\]Bot`,
        });

      expect(response.status).to.be.equal(200);
      const hook = await CustomHook.findOne(response.body.id);
      expect(hook.regex).to.be.equal('\[[a-fA-F0-8]{6}\]Bot');
    });
  });

  describe('PATCH /api/sdtdserver/hook', () => {
    it('Can update a hook', async () => {
      const hook = await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'test',
        event: 'logLine',
        searchString: 'testttt',
      }).fetch();

      const response = await supertest(sails.hooks.http.mockApp)
        .patch(`/api/sdtdserver/hook`)
        .send({
          commandsToExecute: 'test2',
          hookId: hook.id,
          serverId: sails.testServer.id,
          event: 'playerConnected',
        });

      expect(response.status).to.be.equal(200);
      const hook2 = await CustomHook.findOne(hook.id);
      expect(hook2.commandsToExecute).to.be.equal('test2');
    });
  });

  describe('DELETE /api/sdtdserver/hook', () => {
    it('Can delete a hook', async () => {
      const hook = await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'test',
        event: 'logLine',
        searchString: 'testttt',
      }).fetch();

      const response = await supertest(sails.hooks.http.mockApp)
        .delete(`/api/sdtdserver/hook`)
        .query({ hookId: hook.id, serverId: sails.testServer.id });

      expect(response.status).to.be.equal(200);
      const hook2 = await CustomHook.findOne(hook.id);
      expect(hook2).to.be.equal(undefined);
    });
  });

  describe('GET /api/sdtdserver/hook', () => {
    it('Can get a hook', async () => {
      const hook = await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'test',
        event: 'logLine',
        searchString: 'testttt',
      }).fetch();

      const response = await supertest(sails.hooks.http.mockApp)
        .get(`/api/sdtdserver/hook`)
        .query({ hookId: hook.id, serverId: sails.testServer.id });
      expect(response.status).to.be.equal(200);
      expect(response.body.id).to.be.equal(hook.id);
    });
  });

  // Do POST, GET, PATCH, GET, DELETE, GET
  it('Full integration test', async () => {
    const response = await supertest(sails.hooks.http.mockApp)
      .post('/api/sdtdserver/hook')
      .send({
        serverId: sails.testServer.id,
        commandsToExecute: 'test',
        event: 'logLine',
        searchString: 'testttt',
      });

    expect(response.status).to.be.equal(200);
    const hook = await CustomHook.findOne(response.body.id);
    expect(hook.commandsToExecute).to.be.equal('test');
    expect(hook.event).to.be.equal('logLine');
    expect(hook.searchString).to.be.equal('testttt');

    const response2 = await supertest(sails.hooks.http.mockApp)
      .get(`/api/sdtdserver/hook`)
      .query({ hookId: hook.id, serverId: sails.testServer.id });

    expect(response2.status).to.be.equal(200);
    expect(response2.body.id).to.be.equal(hook.id);

    const response3 = await supertest(sails.hooks.http.mockApp)
      .patch(`/api/sdtdserver/hook`)
      .send({
        commandsToExecute: 'test2',
        hookId: hook.id,
        serverId: sails.testServer.id,
        event: 'playerConnected',
      });

    expect(response3.status).to.be.equal(200);

    const response4 = await supertest(sails.hooks.http.mockApp)
      .get(`/api/sdtdserver/hook`)
      .query({ hookId: hook.id, serverId: sails.testServer.id });
    expect(response4.status).to.be.equal(200);
    expect(response4.body.id).to.be.equal(hook.id);

    const response5 = await supertest(sails.hooks.http.mockApp)
      .delete(`/api/sdtdserver/hook`)
      .query({ hookId: hook.id, serverId: sails.testServer.id });

    expect(response5.status).to.be.equal(200);
  });
});
