describe('HELPER sdtd/check-mod-version', () => {
  it('returns 33.2 for newer versions', async () => {
    sandbox.stub(sails.helpers.sdtdApi, "executeConsoleCommand").callsFake(async function() {
      return {
        command: 'version',
        parameters: '',
        result: 'Game version: Alpha 19 (b154) Compatibility Version: Alpha 19\r\n' +
          'Mod Allocs command extensions (Patty edit for A19 b109): 20.2\r\n' +
          'Mod Allocs server fixes  (Patty edit for A19 b109): 23.2\r\n' +
          'Mod Allocs MapRendering and Webinterface (Patty edit for A19 b109): 33.2\r\n'
      }
    });
    const result = await sails.helpers.sdtd.checkModVersion('Mod Allocs MapRendering and Webinterface', sails.testServer.id);
    expect(result).to.eql(33.2);
  });
});


