const hashFile = require('./hashFile');
module.exports = (filename) => `<link rel="stylesheet" href="${filename}?v=${hashFile(filename)}">`;

