const hashFile = require('./hashFile');
module.exports = (filename) => `<script src="${filename}?v=${hashFile(filename)}"></script>`;
