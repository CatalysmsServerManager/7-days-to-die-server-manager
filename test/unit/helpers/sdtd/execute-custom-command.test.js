const { expect } = require('chai');

describe('HELPER execute-custom-command', function () {
  beforeEach(function () {
    sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').resolves({ result: 'it worked yay' });
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
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`say "onlinePlayers: 0"`);
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
    `, { player: sails.testPlayer, server: { onlinePlayers: [sails.testPlayer] } });
    expect(res).to.have.length(1);
    expect(res[0]).to.be.eql({ result: 'it worked yay' });
    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.equal(`pm ${sails.testPlayer.steamId} "Hey ${sails.testPlayer.name} Test2"`);
  });

});





