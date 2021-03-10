const { expect } = require('chai');
const faker = require('faker');

describe('HELPER execute-custom-command', function () {
  beforeEach(function () {
    sandbox.stub(sails.helpers.sdtdApi, 'getStats').resolves({
      gametime: {
        days: faker.random.number({ min: 1, max: 250 }),
        hours: faker.random.number({ min: 0, max: 24 }),
        minutes: faker.random.number({ min: 1, max: 60 })
      },
      players: faker.random.number({ min: 1, max: 20 }),
      hostiles: faker.random.number({ min: 1, max: 100 }),
      animals: faker.random.number({ min: 1, max: 100 })
    });
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves({ result: 'it worked yay' });
    sandbox.stub(sails.helpers.sdtd, 'loadPlayerData').resolves([sails.testPlayer]);
  });

  it('Parses and executes a command string', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'say Hello', {});
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal('say Hello');
  });

  it('Can handle legacy variable syntax', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'say "Hello ${player.steamId}"', { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`say "Hello ${sails.testPlayer.steamId}"`);
  });

  it('Can handle legacy player-scoped variable syntax', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'say "Hello ${steamId}"', { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`say "Hello ${sails.testPlayer.steamId}"`);
  });

  it('Can handle handlebars template syntax', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'say "Hello {{ player.steamId }}"', { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`say "Hello ${sails.testPlayer.steamId}"`);
  });

  it('Populates a onlinePlayers datapoint', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'say "onlinePlayers: {{ server.onlinePlayers.length }}"', { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`say "onlinePlayers: 1"`);
  });

  it('Can handle complex handlebars template syntax', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
    {{#each server.onlinePlayers}}
{{#if (eq this.role.level 5)}}
pm {{this.steamId}} "Hey {{this.name}} Test1";
{{else}}
pm {{this.steamId}} "Hey {{this.name}} Test2";
{{/if}}
{{/each}}
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`pm ${sails.testPlayer.steamId} "Hey ${sails.testPlayer.name} Test2"`);
  });

  it('Handles server.stats varaibles', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "Current time is: {{server.stats.gametime.hours}}:{{server.stats.gametime.minutes}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.match(/say "Current time is: \d+:\d+"/);
  });


  it('Can do sum', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "1 + 1 = {{sum 1 1}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 + 1 = 2"`);
  });

  it('Can subtract', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "1 - 1 = {{subtract 1 1}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 - 1 = 0"`);
  });

  it('Can multiply', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "2 * 3 = {{multiply 2 3}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "2 * 3 = 6"`);
  });

  it('Can divide', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "6 / 3 = {{divide 6 3}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "6 / 3 = 2"`);
  });


  it('Can modulo', async function () {
    const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "8 % 6 = {{mod 8 6}}"
    `, { player: sails.testPlayer });
    expect(res).to.have.length(1);
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "8 % 6 = 2"`);
  });
});






