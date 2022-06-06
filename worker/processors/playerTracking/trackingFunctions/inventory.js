module.exports = async function inventoryTracking(server, playerList, playersArray, playerRecords) {
  let dateStarted = new Date();
  let inventories = new Array();
  try {
    inventories = await sails.helpers.sdtdApi.getPlayerInventories(SdtdServer.getAPIConfig(server));
  } catch (error) {
    sails.log.warn(`${server.name} Errored during inventory tracking - ${error}.`, { server });
  }


  for (const onlinePlayer of playerList) {
    let playerRecord = playerRecords.filter(player => onlinePlayer.steamid === player.steamId);
    if (playerRecord.length === 1) {

      let trackingRecord = playersArray.filter(record => record.player === playerRecord[0].id);
      let trackingRecordIdx = playersArray.indexOf(trackingRecord[0]);

      if (trackingRecord.length === 1) {
        let inventory = inventories.filter(inventoryEntry => inventoryEntry.steamid === playerRecord[0].steamId || inventoryEntry.userid === playerRecord[0].steamId);
        if (inventory.length === 1) {
          let itemsInInventory = new Array();
          inventory = inventory[0];

          inventory.bag = _.filter(inventory.bag, (value) => !_.isNull(value));
          inventory.belt = _.filter(inventory.belt, (value) => !_.isNull(value));
          inventory.equipment = _.filter(inventory.equipment, (value) => !_.isNull(value));

          for (const inventoryItem of inventory.bag) {
            itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
          }

          for (const inventoryItem of inventory.belt) {
            itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
          }

          for (const inventoryItem of inventory.equipment) {
            itemsInInventory.push(_.omit(inventoryItem, 'iconcolor', 'qualitycolor', 'icon'));
          }

          trackingRecord[0].inventory = itemsInInventory;
          playersArray[trackingRecordIdx] = trackingRecord[0];
        }
      }
    }
  }

  let dateEnded = new Date();
  sails.log.debug(`Performed inventory tracking for ${server.name} - ${playerList.length} players, took ${dateEnded.valueOf() - dateStarted.valueOf()} ms`, { server });
  return playersArray;
};
