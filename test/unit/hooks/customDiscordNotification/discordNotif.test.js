const { expect } = require('chai');
const customDiscordNotification = require('../../../../api/hooks/customDiscordNotification');

function logLine(msg) {
    return {
        msg,
        server: sails.testServer
    };
}

describe('HOOK Custom Discord notifications', () => {

    beforeEach(async function () {
        this.channelSpy = sandbox.spy();
        sandbox.stub(sails.helpers.discord, 'getClient').returns({
            channels: { cache: { get: () => { return { send: this.channelSpy }; } } }
        });

        await CustomDiscordNotification.create({
            stringToSearchFor: 'unittest',
            ignoreServerChat: true,
            discordChannelId: 'test-channel',
            server: sails.testServer.id
        });
    });

    it('Detects messages with string matching', async function () {
        await sails.hooks.customdiscordnotification.handleLogLine(logLine('unittest'));
        expect(this.channelSpy).to.have.been.calledOnce;
    });

    it('Can ignore server chat', async function () {
        await sails.hooks.customdiscordnotification.handleLogLine(logLine('unittest'));
        expect(this.channelSpy).to.have.been.calledOnce;
        await sails.hooks.customdiscordnotification.handleLogLine(logLine('chat (from \'-non-player-\', unittest'));
        expect(this.channelSpy).to.have.been.calledOnce;
    });

});
