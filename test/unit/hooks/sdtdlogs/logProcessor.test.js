const logProcessor = require('../../../../api/hooks/sdtdLogs/logProcessor');
const { expect } = require('chai');


describe('logProcessor', function () {

    beforeEach(() => {
        sails.helpers.sdtdApi.getWebUIUpdates = sandbox.stub().returns({ newLogs: 13 });
        sails.helpers.sdtdApi.getLog = sandbox.stub().returns({ entries: [] });
    });

    it('resets lastLogLine if job.data.lastLogLine is 0', async function () {
        await logProcessor({ data: { lastLogLine: 0, server: sails.testServer } });
        expect(sails.helpers.sdtdApi.getWebUIUpdates).to.have.been.callCount(1);
    });

    it('resets lastLogLine if job.data.lastLogLine is "0"', async function () {
        await logProcessor({ data: { lastLogLine: "0", server: sails.testServer } });
        expect(sails.helpers.sdtdApi.getWebUIUpdates).to.have.been.callCount(1);
    });
});