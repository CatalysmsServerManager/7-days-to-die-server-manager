const { Sequelize } = require('sequelize');
// This should use a shared Sequelize connection in the future
// For now, those models are not in place yet so this is just a quick patch
const sequelize = new Sequelize(process.env.DBSTRING.replace('mysql2://', 'mysql://'));

module.exports = {


  friendlyName: 'Health',


  description: '',


  inputs: {},


  exits: {

  },


  fn: async function (inputs, exits) {
    await sequelize.query('SELECT 1');
    return exits.success();
  }
};
