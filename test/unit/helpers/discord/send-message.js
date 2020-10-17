const { expect } = require('chai');
const { CustomEmbed } = require('../../../../api/hooks/discordBot/util/createEmbed');

describe('HELPER discord.sendMessage', () => {
  it('Validates correctly', async () => {
    sandbox.stub(sails.helpers.discord, 'discordrequest').callsFake(() => { });
    // No channel ID
    await expect(sails.helpers.discord.sendMessage()).to.eventually.be.rejectedWith('Could not run sendMessage() because of a problem:\n------------------------------------------------------\n• "channelId" is required, but it was not defined.\n------------------------------------------------------\n\nPlease adjust your usage and try again.\n [?] See https://sailsjs.com/support for help.');
    // Invalid channel id
    await expect(sails.helpers.discord.sendMessage('fafsafas')).to.eventually.be.rejectedWith('Could not run sendMessage() because of a problem:\n------------------------------------------------------\n• Invalid "channelId":\n  · Value (\'fafsafas\') did not match the configured regular expression (/[\\d]{18}$/)\n------------------------------------------------------\n\nPlease adjust your usage and try again.\n [?] See https://sailsjs.com/support for help.');
    // No content or embed
    await expect(sails.helpers.discord.sendMessage('577950911582961664')).to.eventually.be.rejectedWith('Invalid usage, must provide either content or embed');

    // Invalid embed
    await expect(sails.helpers.discord.sendMessage('577950911582961664', undefined, { idk: 'should be invalid' })).to.eventually.be.rejectedWith('Could not run sendMessage() because of a problem:\n------------------------------------------------------\n• Invalid "embed":\n  · Value ({ idk: \'should be invalid\' }) failed custom validation.\n------------------------------------------------------\n\nPlease adjust your usage and try again.\n [?] See https://sailsjs.com/support for help.');

    // Success
    await expect(sails.helpers.discord.sendMessage('577950911582961664', 'Hello!')).to.eventually.be.fulfilled;
    await expect(sails.helpers.discord.sendMessage('577950911582961664', undefined, new CustomEmbed())).to.eventually.be.fulfilled;
  });

});
