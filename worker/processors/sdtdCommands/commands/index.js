const balance = require('./balance');
const callAdmin = require('./callAdmin');
const claim = require('./claim');
const gimme = require('./gimme');
const help = require('./help');
const listTele = require('./listTele');
const pay = require('./pay');
const removetele = require('./removetele');
const renameTele = require('./renameTele');
const seen = require('./seen');
const setTele = require('./setTele');
const shop = require('./shop');
const tele = require('./tele');
const teleprivate = require('./teleprivate');
const telePublic = require('./telePublic');
const vote = require('./vote');
const who = require('./who');

const commands = new Map([
  ['balance', new balance() ],
  ['calladmin', new callAdmin() ],
  ['claim', new claim() ],
  ['gimme', new gimme() ],
  ['help', new help() ],
  ['listtele', new listTele() ],
  ['pay', new pay() ],
  ['removetele', new removetele() ],
  ['renametele', new renameTele() ],
  ['seen', new seen() ],
  ['settele', new setTele() ],
  ['shop', new shop() ],
  ['tele', new tele() ],
  ['teleprivate', new teleprivate() ],
  ['telePublic', new telePublic() ],
  ['vote', new vote() ],
  ['who', new who() ],
]);

module.exports = commands;
