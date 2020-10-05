require('dotenv').config();

module.exports = {};

['local', 'test', 'development', 'production'].forEach(env => {
  module.exports[env] = {
    // Sequelize doesn't like mysql2
    // This automatically fixes the url
    url: process.env.DBSTRING.replace('mysql2://', 'mysql://'),
    dialect: 'mysql',
    logging: console.log
  };
});
if (process.env.TEST_DBSTRING) {
  module.exports.test.url = process.env.TEST_DBSTRING.replace('mysql2://', 'mysql://');
}
module.exports.test.logging = false;
