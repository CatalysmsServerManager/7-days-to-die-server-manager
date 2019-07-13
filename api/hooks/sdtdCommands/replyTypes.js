module.exports = [{
    command: 'Balance',
    pretty: 'Balance reply',
    type: 'balanceReply',
    default: 'Your balance is currently ${playerBalance} ${server.config.currencyName}',
  },
  {
    command: 'Call admin',
    pretty: 'Call admin - missing reason',
    type: 'callAdminMissingReason',
    default: "You must tell us what you're having trouble with!",
  },
  {
    command: 'Call admin',
    pretty: 'Call admin - message too long',
    type: 'callAdminTooLong',
    default: 'Your message is too long! A ticket title can hold maximum 50.000 characters.',
  },
  {
    command: 'Call admin',
    pretty: 'Call admin - Ticket created',
    type: 'callAdminSuccess',
    default: 'Your ticket has been created, check the website to follow up!',
  }
];
