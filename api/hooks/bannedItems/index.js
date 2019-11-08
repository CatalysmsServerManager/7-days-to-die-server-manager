module.exports = function banneditems(sails) {
  return {
    initialize: function(cb) {
      sails.on("hook:sdtdlogs:loaded", async function() {
        try {
          let configs = await SdtdConfig.find({
            inactive: false
          });

          for (const config of configs) {
            if (config.bannedItemsEnabled) {
              try {
                start(config.server);
              } catch (error) {
                sails.log.error(
                  `Error initializing bannedItemsList for server ${config.server} - ${error}`
                );
              }
            }
          }

          sails.log.info(`HOOK: bannedItemsList - Initialized`);
          return cb();
        } catch (error) {
          sails.log.error(`HOOK:bannedItemsList ${error}`);
        }
      });
    },

    start: start,
    stop: stop
  };

  function start(serverId) {
    const loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);

    loggingObject.on("trackingUpdate", handleItemTrackerUpdate);
    return;
  }

  function stop(serverId) {
    const loggingObject = sails.hooks.sdtdlogs.getLoggingObject(serverId);
    loggingObject.removeListener("trackingUpdate", handleItemTrackerUpdate);
    return;
  }

  async function handleItemTrackerUpdate(data) {
    const { server, trackingInfo } = data;
    const config = server.config[0];
    const { bannedItems, bannedItemsCommand } = config;
    const bannedItemsSet = new Set(JSON.parse(bannedItems));

    for (const onlinePlayer of trackingInfo) {
      const playerItemsSet = new Set(onlinePlayer.inventory.map(e => e.name));
      const unionOfSets = intersection(playerItemsSet, bannedItemsSet);
      if (unionOfSets.size) {
        sails.log.info(
          `Detected banned item(s) on player ${onlinePlayer.player} from server ${onlinePlayer.server}`
        );
        executePunishment(onlinePlayer.player, server, config);
      }
    }
  }

  async function executePunishment(playerId, server, config) {
    const player = await Player.findOne(playerId);
    await sails.helpers.sdtd.executeCustomCmd(
      server,
      config.bannedItemsCommand.split(";"),
      { player: player }
    );
  }

  function intersection(setA, setB) {
    const _intersection = new Set();
    for (const elem of setB) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }
};
