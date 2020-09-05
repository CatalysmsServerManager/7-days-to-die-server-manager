require('dotenv').config();

// Sequelize doesn't like mysql2
// This automatically fixes the url
process.env.DBSTRING = process.env.DBSTRING.replace('mysql2://', 'mysql://');

const commonConfig = {
  url: process.env.DBSTRING,
  dialect: 'mysql'
};

module.exports = {
  local: commonConfig,
  test: commonConfig,
  development: commonConfig,
  production: commonConfig
};

