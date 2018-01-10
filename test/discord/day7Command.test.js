describe('DISCORD COMMAND - Day 7', function () {

  it('Should send a MessageEmbed', function (done) {
    let client = sails.hooks.discordbot.getClient()
    const command = client.registry.commands.get('day7')

    sails.testChannel.send('day7')
      .then(commandMessage => {
        command.run(commandMessage)
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
