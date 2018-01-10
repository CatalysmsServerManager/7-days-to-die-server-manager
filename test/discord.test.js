const getMessageMock = (content) => {
  let client = sails.hooks.discordbot.getClient()
  return {
    content: content,
    author: client.user.id,
    channel: sails.testChannel
  }
}

describe('Discord Bot', function () {

  beforeEach(function (done) {
    this.timeout(5000)
    setTimeout(done,2000)
  })
  describe('Basic functionality', function () {
    it('should be logged in', function (done) {
      let client = sails.hooks.discordbot.getClient()
      if (client.status != 0) {
        done(new Error(`Client has status: ${client.status}`))
      } else {
        done()
      }
    });
    it('should be able to send a message in the test channel', function (done) {
      sails.testChannel.send('Starting tests')
        .then(msg => {
          done()
        })
        .catch(error => {
          done(error)
        })
    })
  })

  describe('Command - day7', function () {
    it('Should send a MessageEmbed', function (done) {
      let client = sails.hooks.discordbot.getClient()
      const command = client.registry.commands.get('day7')

      sails.testChannel.send('day7')
        .then(commandMessage => {
          command.run(commandMessage)
            .then(resultMessage => {
                console.log(resultMessage)
              done()
            })
            .catch(error => {
              done(error)
            })
        })
        .catch(error => {
          done(error)
        })
    });
  });
  describe('Command - addServer', function () {

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

})
