const { expect } = require('chai');
const faker = require('faker');
const wait = require('../../../../worker/util/wait');

describe('HELPER execute-custom-command', function () {
  beforeEach(function () {
    sandbox.stub(sails.helpers.sdtdApi, 'getStats').resolves({
      gametime: {
        days: faker.datatype.number({ min: 1, max: 250 }),
        hours: faker.datatype.number({ min: 0, max: 24 }),
        minutes: faker.datatype.number({ min: 1, max: 60 })
      },
      players: faker.datatype.number({ min: 1, max: 20 }),
      hostiles: faker.datatype.number({ min: 1, max: 100 }),
      animals: faker.datatype.number({ min: 1, max: 100 })
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

  describe('custom functions', () => {
    it('Can execute a custom function', async function () {
      const stub = sandbox.stub(wait, 'wait');
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'wait(5)', { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(res[0].parameters).to.be.equal('wait(5)');
      expect(res[0].result).to.be.equal('Waited for 5 seconds');
      expect(stub.calledOnce).to.be.true;
      expect(stub).to.have.been.calledOnceWith(5);
    });

    it('Handles complex arguments', async function () {
      const role = await Role.create({ name: 'test, aaa', level: 5, server: sails.testServer.id }).fetch();
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `setRole(${sails.testPlayer.steamId}, "${role.name}")`, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(res[0].parameters).to.match(/setRole\(\d+, "test, aaa"\)/);
      expect(res[0].result).to.be.match(/Set player \d+ to role test, aaa/);

      const player = await Player.findOne(sails.testPlayer.id).populate('role');
      if (!player.role) { throw new Error('Player has no role set'); }
      expect(player.role.id).to.be.equal(role.id);
    });

    it('Can execute a custom function case insensitive', async function () {
      const stub = sandbox.stub(wait, 'wait');
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'wait(5)', { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(res[0].parameters).to.be.equal('wait(5)');
      expect(res[0].result).to.be.equal('Waited for 5 seconds');
      expect(stub.calledOnce).to.be.true;
      expect(stub).to.have.been.calledOnceWith(5);

      const resCase = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'WaIt(5)', { player: sails.testPlayer });
      expect(resCase).to.have.length(1);
      expect(resCase[0].parameters).to.be.equal('WaIt(5)');
      expect(resCase[0].result).to.be.equal('Waited for 5 seconds');
      const calls = stub.getCalls();
      expect(calls).to.have.lengthOf(2);
      for (const call of calls) {
        expect(call.firstArg).to.be.equal(5);

      }
    });

    it('Persists case after passing through function', async function () {
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'sendDiscord(12345, "heLlO wItH caSe")', { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(res[0].customFunctionArgs).to.be.equal('12345, "heLlO wItH caSe"');
      expect(res[0].result).to.be.equal('Invalid channel ID');
    });
  });

  describe('handlebars', () => {
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



    it('Can do sum', async function () {
      let res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "1 + 1 = {{sum 1 1}}"
    `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 + 1 = 2"`);

      // Check the alias too
      res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
    say "1 + 1 = {{add 1 1}}"
        `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 + 1 = 2"`);
    });

    it('sum defaults to numeric addition, even when one of the arguments is a string', async function () {
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
    say "1 + 1 = {{sum "1" 1}}"
        `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 + 1 = 2"`);

    });

    it('sum can do string concatenation', async function () {
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
    say "Hello world = {{sum "Hello " "world"}}"
        `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "Hello world = Hello world"`);

    });


    it('Can subtract', async function () {
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
say "1 - 1 = {{subtract 1 1}}"
    `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`say "1 - 1 = 0"`);
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

    it('Can round', async function () {
      let res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
  {{round 8.123456789 1}}
      `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`8.1`);


      res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
      {{round 8.123456789 -1}}
          `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(1).lastArg).to.be.eq(`8.1`);

      res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
  {{round 8.123456789 5}}
      `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(2).lastArg).to.be.eq(`8.12346`);

      res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
      {{round 8.123456789}}
          `, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(3).lastArg).to.be.eq(`8`);
    });

    it('Can sort arrays asc', async function () {
      const randomPlayerLevel = () => ({ ...sails.testPlayer, role: { level: faker.datatype.number() } });
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
      {{#each (sort players "role.level" "asc")}}
            {{this.role.level}}
      {{/each}}"`, { players: Array.from({ length: 50 }, () => randomPlayerLevel()) });
      expect(res).to.have.length(1);
      const resNumbers = sails.helpers.sdtdApi.executeConsoleCommand
        .getCall(0).lastArg
        .split('\n')
        .map(_ => parseInt(_, 10))
        .filter(_ => !isNaN(_));
      expect(resNumbers).to.have.length(50);
      for (let i = 0; i < resNumbers.length - 1; i++) {
        expect(resNumbers[i]).to.be.at.most(resNumbers[i + 1]);
      }
    });

    it('Can sort arrays desc', async function () {
      const randomPlayerLevel = () => ({ ...sails.testPlayer, role: { level: faker.datatype.number() } });
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
      {{#each (sort players "role.level" "desc")}}
            {{this.role.level}}
      {{/each}}"`, { players: Array.from({ length: 50 }, () => randomPlayerLevel()) });
      expect(res).to.have.length(1);
      const resNumbers = sails.helpers.sdtdApi.executeConsoleCommand
        .getCall(0).lastArg
        .split('\n')
        .map(_ => parseInt(_, 10))
        .filter(_ => !isNaN(_));
      expect(resNumbers).to.have.length(50);
      for (let i = 0; i < resNumbers.length - 1; i++) {
        expect(resNumbers[i]).to.be.at.least(resNumbers[i + 1]);
      }
    });
  });

  describe('randNum helper', function () {

    it('Can do randNum', async function () {
      for (let i = 0; i < 500; i++) {
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
        say "randNum = {{ randNum 1 9 }}"
            `, { player: sails.testPlayer });
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(i).lastArg).to.match(/say "randNum = [1-9]"/);
      }
    });

    it('randNum has protection against max < min', async function () {
      for (let i = 0; i < 500; i++) {
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
        say "randNum = {{ randNum 9 1 }}"
            `, { player: sails.testPlayer });
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(i).lastArg).to.match(/say "randNum = [1-9]"/);
      }
    });

    it('randNum can handle negatives', async function () {
      for (let i = 0; i < 500; i++) {
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
        say "randNum = {{ randNum -9 -1 }}"
            `, { player: sails.testPlayer });
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(i).lastArg).to.match(/say "randNum = -[1-9]"/);
      }
    });
  });


  describe('randList helper', function () {

    it('Can select a random string from a list', async function () {
      for (let i = 0; i < 500; i++) {
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer,
          `say randList = {{ randList "a" "b" "c" "d" "e" }}`, { player: sails.testPlayer });

        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(i).lastArg)
          .to.match(/randList = [a-e]/);
      }
    });
  });


  it('Can do a thing with custom vars inside a loop', async () => {
    const template = `
      {{#each server.onlinePlayers}}
        w2l "test X:{{../custom.PositionX}} Z:{{../custom.PositionZ}} X:{{this.positionX}} Z:{{this.positionZ}}"
      {{/each}}
    `;

    await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer, custom: { PositionX: 1, PositionZ: 2 } });

    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg)
      .to.equal('w2l "test X:1 Z:2 X:0 Z:0"');

  });

  it('Populates server.config.something', async () => {
    const template = 'say "Test: ${server.config.currencyName}"';

    await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });

    expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.equal('say "Test: dolla dolla billz"');

  });

});







