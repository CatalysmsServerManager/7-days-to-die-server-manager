const DUPLICATE_PLAYER_QUERY = `SELECT *
FROM player
   INNER JOIN (SELECT steamId
               FROM   player
               GROUP  BY steamId, server
               HAVING COUNT(steamId) > 1) dup
           ON player.steamId = dup.steamId`;

module.exports = {


  friendlyName: 'Fix duplicate players',


  description: '',


  inputs: {},


  exits: {},


  fn: async function (inputs, exits) {

    const idsToDelete = [];

    let result = await sails.sendNativeQuery(DUPLICATE_PLAYER_QUERY);

    let serverOrderedResult = _.groupBy(result.rows, 'server');

    _.each(serverOrderedResult, (dupPlayerArray, server) => {
      let ordered = _.groupBy(dupPlayerArray, 'steamId');
      _.each(ordered, (playerArr, steamId) => {
        let smallestId = _.min(playerArr.map(p => p.id));
        let profileToKeep = _.find(playerArr, ['id', smallestId]);
        let profilesToDelete = _.filter(playerArr, player => {
          return player.id !== profileToKeep.id;
        });
        for (const profileToDelete of profilesToDelete) {
          idsToDelete.push(profileToDelete.id);
        }
      });

    });
    sails.log.debug(`Found ${idsToDelete.length} profiles to delete out of ${result.rows.length} players`);

    await Player.destroy({id: idsToDelete});
    
    return exits.success(idsToDelete.length);

  }


};
