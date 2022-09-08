const ExecCommand = require('./execCommand');
const ListServers = require('./listServers');
const Lookup = require('./lookup');
const Player = require('./player');
const Status = require('./status');
const Top = require('./top');

module.exports = new Map([
  ['top', Top],
  ['list-servers', ListServers],
  ['execute-command', ExecCommand],
  ['lookup', Lookup],
  ['player', Player],
  ['status', Status]
]);
