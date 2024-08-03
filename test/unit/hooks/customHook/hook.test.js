const handler = require('../../../../worker/processors/hooks');
const sinon = require('sinon');
const { expect } = require('chai');
const hooksCache = require('../../../../api/hooksCache');

const event = (type, msg) => {
  return {
    data: {
      type,
      data: {
        date: '2020-11-05',
        time: '10:36:38',
        uptime: '23609.788',
        msg,
        trace: '',
        type: 'Log',
        server: {
          config: sails.testConfig,
          ...sails.testServer
        }
      },
      server: sails.testServer

    }
  };
};

describe('Custom hooks', () => {
  beforeEach(async () => {
    this.mock = sandbox.stub(sails.helpers.sdtd, 'executeCustomCmd').returns(['something']);
  });

  for (const eventType of [
    'playerConnected',
    'playerDisconnected',
    'chatMessage',
    'playerDeath',
    'playerJoined',
    'playerLevel',
    'zombieKilled',
    'animalKilled',
    'playerKilled',
    'logLine',
    'playerSuicide'
  ]
  ) {



    it(`Fires a logLine hook ${eventType}`, async () => {

      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'say "it works"',
        event: 'logLine',
        searchString: 'some log line',
      });

      await handler(event('logLine', 'some log line'));
      expect(this.mock).to.have.been.calledOnce;

    });
    it(`Fires all built-in hooks ${eventType}`, async () => {
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.have.been.calledWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);
    });
    it(`Fires when search string matches ${eventType}`, async () => {
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        searchString: 'some other log line',
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.not.have.been.calledOnceWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);

      await hooksCache.reset(sails.testServer.id);

      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        searchString: 'some log line',
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.have.been.calledWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);
    });
    it(`Fires when search string matches ${eventType} with no caseSensitive`, async () => {
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        searchString: 'sOMe other LOg line',
        caseSensitive: false
      });

      await handler(event(eventType, 'some Log LIne'));
      expect(this.mock).to.not.have.been.calledOnceWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);;

      await hooksCache.reset(sails.testServer.id);
      
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        searchString: 'sOmE lOg lINe',
        caseSensitive: false
      });

      await handler(event(eventType, 'Some loG line'));
      expect(this.mock).to.have.been.calledWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);
    });
    it(`Fires when regex matches ${eventType}`, async () => {
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        regex: '(some other log line)',
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.not.have.been.calledOnceWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);

      await hooksCache.reset(sails.testServer.id);
      
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        regex: '(some log line)',
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.have.been.calledWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);
    });

    it(`Fires when regex matches ${eventType} with no caseSensitive`, async () => {
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        regex: '(sOmE oThEr lOg lINe)',
        caseSensitive: false
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.not.have.been.calledOnceWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);

      await hooksCache.reset(sails.testServer.id);
      
      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: `say "${eventType}"`,
        event: eventType,
        regex: '(sOmE lOg lINe)',
        caseSensitive: false
      });

      await handler(event(eventType, 'SoMe log line'));
      expect(this.mock).to.have.been.calledWith(sinon.match.any, `say "${eventType}"`, sinon.match.any);
    });

    it(`Handles cooldowns ${eventType}`, async () => {

      await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'say "it works"',
        event: eventType,
        searchString: 'some log line',
        cooldown: 100
      });

      await handler(event(eventType, 'some log line'));
      expect(this.mock).to.have.been.calledOnce;
      await handler(event(eventType, 'some log line'));
      // Second shouldnt fire because of cooldown so should still have been calledOnce
      expect(this.mock).to.have.been.calledOnce;

    });

    it(`Handles variables ${eventType}`, async () => {
      const hook = await CustomHook.create({
        server: sails.testServer.id,
        commandsToExecute: 'say "${custom.testVar}"',
        event: eventType,
        searchString: 'some log line',
      }).fetch();

      await HookVariable.create({
        hook: hook.id,
        name: 'testVar',
        regex: '\\d{4}',
      }).fetch();


      await handler(event(eventType, 'some log line 12345'));
      expect(this.mock).to.have.been.calledOnceWith(sinon.match.any, 'say "${custom.testVar}"', sinon.match({ custom: { testVar: '1234' } }));
    });
  }

});
