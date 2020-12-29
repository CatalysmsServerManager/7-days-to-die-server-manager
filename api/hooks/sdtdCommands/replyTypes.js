/**
 * If you make any changes to this file, you must also update any existing database records to reflect the changes
 */

module.exports = [{
  command: 'All',
  pretty: 'Error message',
  type: 'error',
  default: 'Oh no, an error occurred! Please contact a server admin. Error: ${error}',
},
{
  command: 'All',
  pretty: 'Command disabled',
  type: 'commandDisabled',
  default: 'This command is disabled! Ask your server admin to enable it.',
},
{
  command: 'All',
  pretty: 'Not enough money',
  type: 'notEnoughMoney',
  default: 'You do not have enough money to do that! This action costs ${cost} ${server.config.currencyName}',
},
{
  command: 'All',
  pretty: 'Only alfanumeric values allowd',
  type: 'OnlyAlfaNumeric',
  default: 'Only alphanumeric values are allowed.',
},
{
  command: 'Balance',
  pretty: 'Balance reply',
  type: 'balanceReply',
  default: 'Your balance is currently ${playerBalance} ${server.config.currencyName}',
},
{
  command: 'Call admin',
  pretty: 'Call admin - missing reason',
  type: 'callAdminMissingReason',
  default: 'You must tell us what you\'re having trouble with!',
},
{
  command: 'Call admin',
  pretty: 'Call admin - message too long',
  type: 'callAdminTooLong',
  default: 'Your message is too long! A ticket title can hold maximum 100 characters.',
},
{
  command: 'Call admin',
  pretty: 'Call admin - Ticket created',
  type: 'callAdminSuccess',
  default: 'Your ticket has been created, check the website to follow up!',
},
{
  command: 'Claim',
  pretty: 'Claim - No items to claim',
  type: 'claimNoItems',
  default: 'You have no items to claim!',
},
{
  command: 'Claim',
  pretty: 'Claim - list',
  type: 'claimList',
  default: 'There are ${totalItems} items for you to claim',
},
{
  command: 'Claim',
  pretty: 'Claim - item given',
  type: 'claimItemGiven',
  default: 'Gave ${item.amount}x ${item.name} of quality ${item.quality}.',
}, {
  command: 'Gimme',
  pretty: 'Gimme - Cooldown',
  type: 'gimmeCooldown',
  default: 'You need to wait ${coolDownRemainderMin} minutes more before executing this command again.',
},
{
  command: 'Gimme',
  pretty: 'Gimme - Nothing configured',
  type: 'gimmeNoConfig',
  default: 'Found 0 configured items. An admin must configure some via the webinterface before this command will work!',
},
{
  command: 'List tele',
  pretty: 'List tele - Too many arguments',
  type: 'listTeleTooManyArguments',
  default: 'Too many arguments! You can only provide a "public" argument.',
},
{
  command: 'List tele',
  pretty: 'List tele - No teleports found',
  type: 'listTeleNoTeleportsFound',
  default: 'Found no teleport location for you!',
},
{
  command: 'List tele',
  pretty: 'List tele - Response',
  type: 'listTeleResponse',
  default: 'Found ${totalTeleports} teleports.',
},
{
  command: 'Pay',
  pretty: 'Pay - Missing arguments',
  type: 'payMissingArguments',
  default: 'Please provide a name or steam ID of the player you want to send money to and the amount.',
},
{
  command: 'Pay',
  pretty: 'Pay - Invalid amount',
  type: 'payInvalidAmount',
  default: 'Amount to send must be a valid integer. You provided ${amount}',
},
{
  command: 'Pay',
  pretty: 'Pay - Player not found',
  type: 'payPlayerNotFound',
  default: 'Did not find the player you want to send to. Try using the steam ID if you are unsure of the spelling of the name',
},
{
  command: 'Pay',
  pretty: 'Pay - Success',
  type: 'paySuccess',
  default: 'Successfully sent ${amountToSend} ${server.config.currencyName} to ${recipient}',
},
{
  command: 'Remove Tele',
  pretty: 'Remove teleport - missing teleport name',
  type: 'removeTeleMissingTeleportName',
  default: 'Please specify what teleport location you want to remove.',
},
{
  command: 'Remove Tele',
  pretty: 'Remove teleport - Too many arguments',
  type: 'removeTeleTooManyArguments',
  default: 'Too many arguments! Just provide a name please.',
},
{
  command: 'Remove Tele',
  pretty: 'Remove teleport - teleport not found',
  type: 'removeTeleTeleportNotFound',
  default: 'Error: Did not find a teleport with that name!',
},
{
  command: 'Remove Tele',
  pretty: 'Remove teleport - Success',
  type: 'removeTeleSuccess',
  default: 'Your teleport ${teleport.name} at ${teleport.x} ${teleport.y} ${teleport.z} which was used ${teleport.timesUsed} times was deleted!',
},
{
  command: 'Rename tele',
  pretty: 'Rename tele - missing argument',
  type: 'renameTeleMissingArgument',
  default: 'Please provide a name for your teleport and a new name',
},
{
  command: 'Rename tele',
  pretty: 'Rename tele - too many arguments',
  type: 'renameTeleTooManyArguments',
  default: 'Too many arguments! Just provide a teleport name and new name please.',
},
{
  command: 'Teleport suite',
  pretty: 'Teleports - No teleport found',
  type: 'NoTeleportFound',
  default: 'No teleport with that name found',
},
{
  command: 'Rename tele',
  pretty: 'Rename tele - Name already in use',
  type: 'renameTeleNameInUse',
  default: 'That name is already in use! Pick another one please.',
},
{
  command: 'Rename tele',
  pretty: 'Rename tele - Success',
  type: 'renameTeleSuccess',
  default: 'Your teleport ${oldName} was renamed to ${newName}',
},
{
  command: 'Seen',
  pretty: 'Seen - missing arguments',
  type: 'seenMissingArguments',
  default: 'You must provide a name, entityId or steamId.',
},
{
  command: 'Seen',
  pretty: 'Seen - More than one player found',
  type: 'seenTooManyPlayers',
  default: 'Found ${amount} players for that query, please specify further or use ID.',
},
{
  command: 'Seen',
  pretty: 'Seen - No player found',
  type: 'seenNoPlayerFound',
  default: 'No player found!',
},
{
  command: 'Seen',
  pretty: 'Seen - Player online now',
  type: 'seenOnlineNow',
  default: '${foundPlayer.name} is online right now!',
},
{
  command: 'Seen',
  pretty: 'Seen - Success',
  type: 'seenSuccess',
  default: '${foundPlayer.name} was last seen on ${date} at ${time}. Thats ${humanDuration}',
},
{
  command: 'Set tele',
  pretty: 'Set tele - Missing name',
  type: 'setTeleMissingName',
  default: 'Please provide a name for your teleport',
},
{
  command: 'Set tele',
  pretty: 'Set tele - Too many arguments',
  type: 'setTeleTooManyArguments',
  default: 'Too many arguments, please provide a name only.',
},
{
  command: 'Set tele',
  pretty: 'Set tele - Too many teleports',
  type: 'setTeleTooManyTeleports',
  default: 'You\'ve set too many locations already, remove one before adding any more',
},
{
  command: 'Set tele',
  pretty: 'Set tele - Too many teleports role',
  type: 'setTeleTooManyTeleportsRole',
  default: 'Your role (${playerRole.name}) is only allowed to have ${playerRole.amountOfTeleports} teleport locations.',
},
{
  command: 'Set tele',
  pretty: 'Set tele - Success',
  type: 'setTeleSuccess',
  default: 'Your teleport ${createdTeleport.name} has been made! (${createdTeleport.x},${createdTeleport.y},${createdTeleport.z})',
},
{
  command: 'Shop',
  pretty: 'Shop - Success',
  type: 'shopSuccess',
  default: 'You have bought ${listing.friendlyName} for ${listing.price} ${server.config.currencyName}',
},
{
  command: 'Shop',
  pretty: 'Shop - view help',
  type: 'shopViewHelp',
  default: 'To view items from page 1: \'${server.config.commandPrefix}shop 1\'',
},
{
  command: 'Shop',
  pretty: 'Shop - buy help',
  type: 'shopBuyHelp',
  default: 'To buy item #4 from page 1: \'${server.config.commandPrefix}shop buy 1 4\'',
},
{
  command: 'Shop',
  pretty: 'Shop - Invalid args',
  type: 'shopInvalidArgs',
  default: 'You have provided invalid arguments to buy an item.',
},
{
  command: 'Shop',
  pretty: 'Shop - No items found',
  type: 'shopNoItemsFound',
  default: 'No item found on page ${page} with number ${itemNumber}',
},
{
  command: 'Shop',
  pretty: 'Shop - item info',
  type: 'shopItemInfo',
  default: '${listing.friendlyName} costs ${listing.price} ${server.config.currencyName}. It consists of ${listing.amount}x ${listing.name} with quality ${listing.quality}',
},
{
  command: 'Tele',
  pretty: 'Tele - cooldown',
  type: 'teleCooldown',
  default: 'You need to wait ${secondsToWait} seconds to teleport again!',
},
{
  command: 'Tele',
  pretty: 'Tele - delay',
  type: 'teleDelay',
  default: 'You will be teleported in ${server.config.playerTeleportDelay} seconds',
},
{
  command: 'Tele',
  pretty: 'Tele - success',
  type: 'teleSuccess',
  default: 'Woosh! Welcome to ${teleport.name}',
},
{
  command: 'Tele private',
  pretty: 'Tele private - success',
  type: 'telePrivateSuccess',
  default: 'Your teleport ${teleport.name} has been set as private.',
},
{
  command: 'Tele public',
  pretty: 'Tele publoc - success',
  type: 'telePublicSuccess',
  default: 'Your teleport ${teleport.name} has been set as public.',
},
{
  command: 'Who',
  pretty: 'Who - No data found',
  type: 'whoNoDataFound',
  default: 'Your teleport ${teleport.name} has been set as public.',
},
{
  command: 'Who',
  pretty: 'Who - Success',
  type: 'whoSuccess',
  default: '${totalPlayers} players have been in a radius of ${size} blocks around your current location since ${date} ${time}',
},
{
  command: 'Vote',
  pretty: 'Vote - Not voted',
  type: 'notVoted',
  default: 'You have not voted yet! You can vote at https://7daystodie-servers.com/server/serverIdToBeFilledByAdmin/',
},
{
  command: 'Vote',
  pretty: 'Vote - alreadyClaimed',
  type: 'alreadyClaimed',
  default: 'You have already claimed your reward today!',
},
];
