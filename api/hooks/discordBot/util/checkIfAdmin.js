
/**
 * @description Checks if a discord user is registered as admin for a server
 * @param {string} discordUserId Id of the discord user
 * @param {number} sdtdServerId Id of the sdtdServer
 */

async function checkIfAdmin(discordUserId, sdtdServerId) {
    
    try {
        const sdtdServer = await SdtdServer.findOne({id: sdtdServerId}).populate('admins').populate('owner');
        let isAdmin = false;
        let client = sails.hooks.discordbot.getClient();
        sdtdServer.admins.forEach(admin => {
            if (admin.discordId == discordUserId) {
                isAdmin = true
            }
        })
        if (sdtdServer.owner.discordId == discordUserId) {
            isAdmin = true
        }

        if (client.isOwner(discordUserId)) {
            isAdmin = true
        }
        
        return isAdmin
    } catch (error) {
        sails.log.error(`HOOK - discordBot:checkIfAdmin - ${error}`)
    }


}

module.exports = checkIfAdmin

