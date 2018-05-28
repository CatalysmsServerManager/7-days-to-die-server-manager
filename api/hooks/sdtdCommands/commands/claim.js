let SdtdCommand = require('../command.js');
const sevenDays = require('machinepack-7daystodiewebapi');

class Claim extends SdtdCommand {
    constructor(serverId) {
        super(serverId, {
            name: 'claim',
        });
        this.serverId = serverId;
    }

    async run(chatMessage, player, server, args) {
        let itemsToClaim = await PlayerClaimItem.find({ player: player.id, claimed: false });

        if (args[0] === 'list') {

            chatMessage.reply(`There are ${itemsToClaim.length} items for you to claim`);
            itemsToClaim.forEach(item => {
                chatMessage.reply(`${item.amount}x ${item.name} of quality ${item.quality}`);
            })

            return 
        }

        if (itemsToClaim.length === 0) {
            return chatMessage.reply(`You have no items to claim!`);
        }

        if (itemsToClaim.length > 10) {
            chatMessage.reply('More than 10 items in queue, only the first 10 will be dropped.')
            itemsToClaim = itemsToClaim.slice(0,10);
        }


        itemsToClaim.forEach(item => {

            let options = {
                ip: server.ip,
                port: server.webPort,
                authName: server.authName,
                authToken: server.authToken,
                entityId: player.entityId,
                amount: item.amount,
                itemName: item.name
            }

            if (item.quality !== 0) {
                Object.defineProperty(options, 'quality', {
                    value: item.quality,
                    writable: true,
                    enumerable: true
                });
            }


            sevenDays.giveItem(options).exec({
                success: async data => {
                    await PlayerClaimItem.update({ id: item.id }, { claimed: true });
                    chatMessage.reply(`Dropped ${item.amount}x ${item.name} of quality ${item.quality} at your feet.`)
                },
                error: e => {
                    sails.log.error(e, item);
                    chatMessage.reply(`Something went wrong while trying to give ${item.name}. Please contact a server admin.`)
                }
            })
        })



    }
}

module.exports = Claim;
