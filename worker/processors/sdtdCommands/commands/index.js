const commands = new Map([
  ['balance', require('./balance')],
  ['calladmin', require('./callAdmin')],
  ['claim', require('./claim')],
  ['gimme', require('./gimme')],
  ['help', require('./help')],
  ['index', require('./index')],
  ['listtele', require('./listTele')],
  ['pay', require('./pay')],
  ['removetele', require('./removetele')],
  ['renametele', require('./renameTele')],
  ['seen', require('./seen')],
  ['settele', require('./setTele')],
  ['shop', require('./shop')],
  ['tele', require('./tele')],
  ['teleprivate', require('./teleprivate')],
  ['telePublic', require('./telePublic')],
  ['vote', require('./vote')],
  ['who', require('./who')],
]);

module.exports = commands;
