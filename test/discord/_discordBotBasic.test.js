describe('Discord bot basic', function () {
  it('should be logged in', function (done) {
    let client = sails.hooks.discordbot.getClient()
    if (client.status != 0) {
        done(new Error(`Client has status: ${client.status}`))
    } else {
        done()
    }
  });
  it('should be able to send a message in the test channel', function(done) {
    sails.testChannel.send('Starting tests')
    .then(msg => {
        done()
    })
    .catch(error => {
        done(error)
    })

  })
})
