describe('DISCORD COMMAND - AddServer', function () {

  it('Should send a MessageEmbed', function (done) {
    let client = sails.hooks.discordbot.getClient()
    const command = client.registry.commands.get('addserver')

    sails.testChannel.send(`addserver`)
      .then(commandMessage => {
        command.run(commandMessage, {
            ip: sails.testServer.ip,
            webPort: sails.testServer.webPort,
            telnetPort: sails.testServer.telnetPort,
            telnetPassword: sails.testServer.telnetPassword
          })
          .then(resultMessage => {
            done()
          })
          .catch(error => {
            done(error)
          })
      })
      .catch(error => {
        done(error)
      })
  })
})
