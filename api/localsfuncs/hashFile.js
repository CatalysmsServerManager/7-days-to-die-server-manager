const crypto = require('crypto');
const path = require('path');
module.exports = function(source) {
  const md5sum = crypto.createHash('md5');
  md5sum.update(path.join('./assets', source), 'utf8');
  return md5sum.digest('hex');
};
