const { Sequelize } = require('sequelize');
// This should use a shared Sequelize connection in the future
// For now, those models are not in place yet so this is just a quick patch
const dbString = process.env.DBSTRING;
let sequelize = null;
if (dbString) {
  // Some environments may use the mysql2 protocol in the URL; normalize it
  const conn = dbString.replace('mysql2://', 'mysql://');
  sequelize = new Sequelize(conn);
}

module.exports = {


  friendlyName: 'Health',


  description: '',


  inputs: {},


  exits: {

  },


  fn: async function (inputs, exits) {
    if (!sequelize) {
      // No DB configured in this environment — treat as healthy for local/dev runs
      return exits.success();
    }

    await sequelize.query('SELECT 1');
    return exits.success();
  }
};
