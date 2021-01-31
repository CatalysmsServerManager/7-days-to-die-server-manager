module.exports = async function donorCheck() {
    const serversPerPage = 50;
    const checksToFailBeforeDeletion = 7;

    if (!process.env.CSMM_DONOR_ONLY) {
        return;
    }


    const serverCount = await SdtdServer.count();
    sails.log.debug(`[Donor check] ${serverCount} servers in the system to check`);

    for (let i = 0; i < serverCount / serversPerPage; i++) {
        const serversToCheck = await SdtdServer.find({
            skip: serversPerPage * i,
            limit: serversPerPage,
        });

        for (const server of serversToCheck) {
            const donorStatus = await sails.helpers.meta.checkDonatorStatus(server.id);

            if (donorStatus !== 'free') {
                sails.log.debug(`[Donor check] server ${serverCount} is a donator! Yay`);
                await SdtdConfig.update({ server: server.id }, { failedDonorChecks: 0 });
                continue;
            }

            let current = await SdtdConfig.findOne({ server: server.id });
            current = (await SdtdConfig.update({ server: server.id }, { failedDonorChecks: current.failedDonorChecks + 1 }).fetch())[0];

            sails.log.warn(`[Donor check] server ${server.id} failed donator check. Has failed ${current.failedDonorChecks} times so far`);
            const user = await User.findOne(server.owner);
            await sails.helpers.discord.sendDm(user.discordId, `WARNING! The CSMM instance you are using is a donator-only instance. CSMM checks your donator status every day and if your server fails ${checksToFailBeforeDeletion} times, it will be automatically deleted. This is check ${current.failedDonorChecks}/${checksToFailBeforeDeletion}`);

            if (current.failedDonorChecks >= checksToFailBeforeDeletion) {
                sails.log.info(`[Donor check] server ${server.id} has failed too many times, deleting the server from the system :(.`);
                await destroyServer(server);
            }

        }

    }

};



async function destroyServer(server) {

    // What are cascades?

    await CronJob.destroy({
        server: server.id
    });

    await CustomCommand.destroy({
        server: server.id
    });

    await HistoricalInfo.destroy({
        server: server.id
    });

    let ticketsToDestroy = await SdtdTicket.find({
        server: server.id
    });

    await TicketComment.destroy({
        ticket: ticketsToDestroy.map(ticket => ticket.id)
    });

    await SdtdTicket.destroy({
        server: server.id
    });

    let playersToDestroy = await Player.find({
        server: server.id
    });

    await PlayerClaimItem.destroy({
        player: playersToDestroy.map(player => player.id)
    });

    await PlayerTeleport.destroy({
        player: playersToDestroy.map(player => player.id)
    });

    await PlayerUsedCommand.destroy({
        player: playersToDestroy.map(player => player.id)
    });

    await Player.destroy({
        server: server.id
    });

    await ShopListing.destroy({
        server: server.id
    });

    await TrackingInfo.destroy({
        server: server.id
    });

    await SdtdConfig.destroy({
        server: server.id
    });
    await SdtdServer.destroy({
        id: server.id
    });
}
