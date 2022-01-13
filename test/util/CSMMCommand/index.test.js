const CSMMCommand = require('../../../worker/util/CSMMCommand');
describe('CSMM Command', () => {

  let command;
  beforeEach(() => {
    command = new CSMMCommand(sails.testServer, 'say "this is a test"', {});
    sandbox.stub(command, '_executeGameCommand').resolves({});
    sandbox.stub(sails.helpers.sdtdApi, 'getStats').returns({});
  });

  it('Stores info about last execution', async () => {

    await command.loadData();
    await command.render();
    await command.execute();


    const lastResults = await CSMMCommand.getLastResults(sails.testServer);
    expect(lastResults).to.have.length(2);
    expect(lastResults[0].reason).to.eq('execute');
    expect(lastResults[0].template).to.eql([ 'say "this is a test"' ]);

    expect(lastResults[1].reason).to.eq('templateRender');
    expect(lastResults[1].template).to.eql([ 'say "this is a test"' ]);
  });
  it('Only keeps last 25 executions per server', async () => {
    for (let i = 0; i < 50; i++) {
      command.template =  `say "this is a test ${i}"` ;
      await command.loadData();
      await command.render();
      await command.execute();
    }

    const lastResults = await CSMMCommand.getLastResults(sails.testServer);
    expect(lastResults).to.have.length(20);
    expect(lastResults[0].template).to.be.eql(['say "this is a test 49"']);
    expect(lastResults[19].template).to.be.eql(['say "this is a test 40"']);
  });
});
