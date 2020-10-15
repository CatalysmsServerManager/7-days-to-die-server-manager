const serverMapUrl = require('../../../api/localsfuncs/serverMapUrl');
describe('serverMapUrl', function () {
  it('disabled map proxy', async function () {
    await SdtdConfig.update({ server: sails.testServer.id }, { mapProxy: 0 });

    const url = await serverMapUrl(sails.testServer.id);
    expect(url).to.match(/^http:\/\/localhost:8082\/map\/{z}\/{x}\/{y}.png\?adminuser=\w+&admintoken=\w+$/);
  });
  it('enabled map proxy', async function () {
    await SdtdConfig.update({ server: sails.testServer.id }, { mapProxy: 1 });

    const url = await serverMapUrl(sails.testServer.id);
    expect(url).to.match(/^\/api\/sdtdserver\/\d+\/tile\/{z}\/{x}\/{y}\/tile.png$/);
  });
});
