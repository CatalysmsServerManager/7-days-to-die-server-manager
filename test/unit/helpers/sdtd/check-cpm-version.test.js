describe('HELPER sdtd/check-cpm-version', () => {
  function stubVersionOutput(modLines) {
    return sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand').callsFake(async function() {
      return {
        command: 'version',
        parameters: '',
        result: 'Game version: V 2.4 (b7) Compatibility Version: V 2.4\r\n' + modLines
      };
    });
  }

  for (const modName of ['Mod CSMM Patrons', 'Mod 1CSMM_Patrons', 'Mod PrismaCore', 'Mod 1PrismaCore', 'Mod ServerCore', 'Mod 1ServerCore']) {
    it(`detects ${modName}`, async () => {
      stubVersionOutput(`Mod TFP_Harmony: 1.1.0.4\r\n${modName}: 3.1.0\r\n`);
      const result = await sails.helpers.sdtd.checkCpmVersion(sails.testServer.id, true);
      expect(result).to.eql(3.1);
    });
  }

  it('returns 0 when no CPM-compatible mod is installed', async () => {
    stubVersionOutput('Mod TFP_Harmony: 1.1.0.4\r\n');
    const result = await sails.helpers.sdtd.checkCpmVersion(sails.testServer.id, true);
    expect(result).to.eql(0);
  });

  it('queries the server version only once', async () => {
    const stub = stubVersionOutput('Mod ServerCore: 3.1.0\r\n');
    await sails.helpers.sdtd.checkCpmVersion(sails.testServer.id, true);
    expect(stub.callCount).to.eql(1);
  });
});
