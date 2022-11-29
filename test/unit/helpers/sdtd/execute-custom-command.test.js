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
      expect(res).to.have.length(2);
      expect(res[0].parameters).to.be.equal('wait(5)');
      expect(res[0].result).to.be.equal('Waited for 5 seconds');
      expect(stub.calledOnce).to.be.true;
      expect(stub).to.have.been.calledOnceWith(5);
    });

    it('Handles complex arguments', async function () {
      const role = await Role.create({ name: 'test, aaa', level: 5, server: sails.testServer.id }).fetch();
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `setRole(${sails.testPlayer.steamId}, "${role.name}")`, { player: sails.testPlayer });
      expect(res).to.have.length(2);
      expect(res[0].parameters).to.match(/setRole\(\d+, "test, aaa"\)/);
      expect(res[0].result).to.be.match(/Set player \d+ to role test, aaa/);

      const player = await Player.findOne(sails.testPlayer.id).populate('role');
      if (!player.role) { throw new Error('Player has no role set'); }
      expect(player.role.id).to.be.equal(role.id);
    });

    it('Can execute a custom function case insensitive', async function () {
      const stub = sandbox.stub(wait, 'wait');
      const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'wait(5)', { player: sails.testPlayer });
      expect(res).to.have.length(2);
      expect(res[0].parameters).to.be.equal('wait(5)');
      expect(res[0].result).to.be.equal('Waited for 5 seconds');
      expect(stub.calledOnce).to.be.true;
      expect(stub).to.have.been.calledOnceWith(5);

      const resCase = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, 'WaIt(5)', { player: sails.testPlayer });
      expect(resCase).to.have.length(2);
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
      expect(res).to.have.length(2);
      expect(res[0].parameters).to.be.equal('sendDiscord(12345, "heLlO wItH caSe")');
      expect(res[0].result[0]).to.be.equal('Invalid channel ID');
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

    describe('datePassed helper', () => {
      it('Detects when a date has passed', async () => {
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
        {{#if (datePassed "${yesterday.toISOString()}")}}
          works
        {{/if}}
        `);
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`works`);
      });

      it('Detects when a date has not passed', async () => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
        const res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, `
        {{#if (datePassed "${tomorrow.toISOString()}")}}
          works
        {{/if}}
        `);
        expect(res).to.have.length(0);
      });
    });


    describe('times helper', () => {
      it('Can do a simple loop', async () => {
        const template = `{{#times 3}}first: {{isFirst}},index: {{index}},last: {{isLast}}{{/times}}`;


        res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`first: true,index: 0,last: falsefirst: false,index: 1,last: falsefirst: false,index: 2,last: true`);
      });
      it('Rejects large numbers', async () => {
        const template = `{{#times 251}}first: {{isFirst}},index: {{index}},last: {{isLast}}{{/times}}`;

        res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });
        expect(res).to.have.length(1);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`{{#times 251}}first: {{isFirst}},index: {{index}},last: {{isLast}}{{/times}}`);

      });
    });

  });

  describe('Extended handlebars helpers', () => {
    it('Can do contains', async () => {
      const template = `
      {{#each server.onlinePlayers}}
        {{#contains this.name "${sails.testPlayer.name[2]}"}}
          Found player with name "{{this.name}}"
        {{/contains}}
      {{/each}}
`;


      res = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });
      expect(res).to.have.length(1);
      expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.be.eq(`Found player with name "${sails.testPlayer.name}"`);

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

  describe('Persistent variables', () => {

    describe('Handlebars integration', () => {
      it('Can set and get a variable', async () => {
        const template = '{{setVar "test" player.steamId}}{{getVar "test"}}';

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.equal(sails.testPlayer.steamId);
      });

      it('Can set a value of 0', async () => {
        const template = '{{setVar "test" 0}}{{getVar "test"}}';

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(0).lastArg).to.equal('0');
      });

      it('Persists across multiple calls', async () => {
        const template1 = '{{setVar "test" player.steamId}}; say "Set the var!"';
        const template2 = 'say "The var is: {{getVar "test"}}"';

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template1, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template2, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(1).lastArg).to.equal(`say "The var is: ${sails.testPlayer.steamId}"`);
      });

      it('Can delete variables', async () => {
        const template1 = '{{setVar "test" player.steamId}}; say "Set the var!"';
        const template2 = 'say "The var is: {{getVar "test"}}"';
        const template3 = '{{delVar "test"}}; say "Delete the var!"';
        const template4 = 'say "The var is: {{getVar "test"}}"';

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template1, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template2, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template3, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template4, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(1).lastArg).to.equal(`say "The var is: ${sails.testPlayer.steamId}"`);
        expect(sails.helpers.sdtdApi.executeConsoleCommand.getCall(3).lastArg).to.equal(`say "The var is: "`);
      });

      it('Can list variables', async() => {
        const names = [
          'exchange:rate',
          'exchange:max',
          'zk_id0',
          'zk_id1',
          'zk_id2',
          'pk_id0',
          'pk_id1',
          'pk_id2'
        ];

        const values = [
          '0.05',
          '10000',
          '0',
          '20',
          '5',
          '12',
          '3',
          '20'
        ];

        let setVarTemplates = [];

        for (let i = 0; i < names.length; i++) {
          setVarTemplates[i] = `{{setVar "${names[i]}" "${values[i]}"}}`;
        }

        for (let setVarTemplate of setVarTemplates) {
          await sails.helpers.sdtd.executeCustomCmd(sails.testServer, setVarTemplate, { player: sails.testPlayer });
        }

        const simpleSearch = `{{#each (listVar "zk_")}}
            {{{this.name}}}
            {{/each}}`;
        const startsWithSearch = `{{#each (listVar "exc*")}}
            {{{this.name}}}
            {{/each}}`;
        const endsWithSearch = `{{#each (listVar "*max")}}
            {{{this.name}}}
            {{/each}}`;
        const containsSearch = `{{#each (listVar "*rat*")}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithLimit = `{{#each (listVar "zk_" 1)}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithSortDesc = `{{#each (listVar "zk_" "name" "desc")}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithSortAsc = `{{#each (listVar "zk_" "name" "asc")}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithTheLot = `{{#each (listVar "zk_" "name" "asc" 2)}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithNoQuery = `{{#each (listVar "")}}
            {{{this.name}}}
            {{/each}}`;
        const searchWithNoResults = `{{#each (listVar "ajhsdkhasjkdhajkshdjkahsd")}}
            {{{this.name}}}
            {{/each}}`;

        let result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, simpleSearch, {});
        let resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'simpleSearch: error running command');
        expect(resultArray).to.have.length(3, 'simpleSearch: invalid length');
        expect(resultArray).to.eql([ 'zk_id0', 'zk_id1', 'zk_id2' ], 'simpleSearch: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, startsWithSearch, {});
        resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'startsWithSearch: error running command');
        expect(resultArray).to.have.length(2, 'startsWithSearch: invalid length');
        expect(resultArray).to.eql([ 'exchange:rate', 'exchange:max' ], 'startsWithSearch: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, endsWithSearch, {});
        let resultString = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg;
        expect(result).to.have.length(1, 'endsWithSearch: error running command');
        expect(resultString).equal('exchange:max', 'endsWithSearch: equal');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, containsSearch, {});
        resultString = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg;
        expect(result).to.have.length(1, 'containsSearch: error running command');
        expect(resultString).equal('exchange:rate', 'containsSearch: equal');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithLimit, {});
        resultString = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg;
        expect(result).to.have.length(1, 'searchWithLimit: error running command');
        expect(resultString).equal('zk_id0', 'searchWithLimit: equal');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithSortDesc, {});
        resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'searchWithSortDesc: error running command');
        expect(resultArray).to.have.length(3, 'searchWithSortDesc: invalid length');
        expect(resultArray).to.eql([ 'zk_id2', 'zk_id1', 'zk_id0' ], 'searchWithSortDesc: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithSortAsc, {});
        resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'searchWithSortAsc: error running command');
        expect(resultArray).to.have.length(3, 'searchWithSortAsc: invalid length');
        expect(resultArray).to.eql([ 'zk_id0', 'zk_id1', 'zk_id2' ], 'searchWithSortAsc: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithTheLot, {});
        resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'searchWithTheLot: error running command');
        expect(resultArray).to.have.length(2, 'searchWithTheLot: invalid length');
        expect(resultArray).to.eql([ 'zk_id0', 'zk_id1'], 'searchWithTheLot: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithNoQuery, {});
        resultArray = sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg
          .split('\n')
          .map((string) => string.trim());
        expect(result).to.have.length(1, 'searchWithNoQuery: error running command');
        expect(resultArray).to.have.length(8, 'searchWithNoQuery: invalid length');
        expect(resultArray).to.eql([ 'exchange:rate', 'exchange:max', 'zk_id0', 'zk_id1', 'zk_id2', 'pk_id0', 'pk_id1', 'pk_id2'], 'searchWithNoQuery: eql');

        result = await sails.helpers.sdtd.executeCustomCmd(sails.testServer, searchWithNoResults, {});
        expect(result).to.have.length(0, 'searchWithNoResults: wait what????');
      });

      it('Can do a counter', async () => {
        const incr = `{{setVar "counter" (add (getVar "counter") 1)}}`;
        const print = `Counter is at: {{getVar "counter"}}`;

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, incr, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, incr, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, incr, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, incr, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, incr, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, print, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg).to.equal('Counter is at: 5');
      });

      it('Allows using persistent variables inside each block', async () => {
        const templateSet = '{{setVar "test" player.steamId}}';

        const template = `{{#each server.onlinePlayers}}
            player {{getVar "test"}}
            {{/each}}`;

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, templateSet, { player: sails.testPlayer });
        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });

        expect(sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg).to.equal(`player ${sails.testPlayer.steamId}`);
      });
    });

    describe('Custom function integration', () => {
      it('Can set and get a var', async () => {
        const template = [
          'setVar("test", 1)',
          'say "testVar = getVar("test")"',
        ].join(';');

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });
        expect(sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg).to.equal(`say "testVar = 1"`);
      });

      it('Can do nested stuff', async () => {
        const template = [
          'setVar("test", 1)',
          'setVar("test2", getVar("test"))',
          'say "testVar = getVar("test2")"',
        ].join(';');

        await sails.helpers.sdtd.executeCustomCmd(sails.testServer, template, { player: sails.testPlayer });
        expect(sails.helpers.sdtdApi.executeConsoleCommand.lastCall.lastArg).to.equal(`say "testVar = 1"`);
      });

    });



  });

});







