const CronJob = require('../../../../../worker/processors/discordNotification/notifications/cronJob');

describe('CronJob', function () {
  beforeEach(function () {
    this.spy = sandbox.stub(sails.helpers.discord, 'sendMessage').callsFake(() => { });
    this.notification = new CronJob();
  });

  // it('Shouldnt try to talk to discord unless all data is available', async function () {
  //   await this.notification.sendNotification({
  //     serverId: sails.testServer.id,
  //     job: {
  //       response: 'foo'
  //     }
  //   });
  //   expect(this.channel.send.callCount).to.equal(0);
  // });
  // it('HAPPY Path', async function () {
  //   await this.notification.sendNotification({
  //     serverId: sails.testServer.id,
  //     job: {
  //       responses: [
  //         {
  //           command: 'something',
  //           parameters: 'something else'
  //         }
  //       ]
  //     }
  //   });
  //   expect(this.channel.send.callCount).to.equal(1);
  //   // expect(this.channel.send.getCall(0).args).to.equal([{}]); // DISABLED cause all the data is random
  // });
  it('Respond when an error occurred', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      job: {
        createdAt: 1584558400790,
        updatedAt: 1584588946156,
        command:
          'say "[FAAC58]Merci de poser un bloc de revendication à l\'emplacement de votre base afin que celle-ci ne soit pas réinitialisé lors de la réinitialisation du lundi.[-]"',
        temporalValue: '*/45 * * * *',
        enabled: true,
        responses: [{ result: 'An error occurred executing the API request to the 7D2D server' }]
      }
    });
    expect(this.spy.callCount).to.equal(1);
    expect(this.spy.getCall(0).args.length).to.eql(3);
    expect(this.spy.getCall(0).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');
    expect(this.spy.getCall(0).args[2].fields).to.eql([
      {
        'inline': true,
        'name': 'Command',
        'value': 'say "[FAAC58]Merci de poser un bloc de revendication à l\'emplacement de votre base afin que celle-ci ne soit pas réinitialisé lors de la réinitialisation du lundi.[-]"'
      },
      {
        'inline': true,
        'name': 'Execution time',
        'value': ' Fri May 01 2020 - 01:20:05 GMT+0000 (Coordinated Universal Time)'
      },
      {
        'inline': false,
        'name': '​',
        'value': '​'
      },
      {
        'inline': false,
        'name': 'Response',
        'value': 'An error occurred executing the API request to the 7D2D server'
      }
    ]);
  });
  it('when command + parameters is too long, it should truncate', async function () {
    await this.notification.sendNotification({
      serverId: sails.testServer.id,
      job: {
        createdAt: 1584558400790,
        updatedAt: 1584588946156,
        command: 'say my failed command',
        temporalValue: '*/45 * * * *',
        enabled: true,
        responses: [{ command: 'say', parameters: Array(255).fill('x').join(''), result: Array(255).fill('x').join('') }]
      }
    });
    expect(this.spy.callCount).to.equal(1);
    expect(this.spy.getCall(0).args.length).to.eql(3);
    expect(this.spy.getCall(0).args[2]).to.have.all.keys('author', 'color', 'description', 'fields', 'file', 'files', 'footer', 'image', 'thumbnail', 'timestamp', 'title', 'url');
    expect(this.spy.getCall(0).args[2].fields).to.eql([
      {
        'inline': true,
        'name': 'Command',
        'value': 'say my failed command'
      },
      {
        'inline': true,
        'name': 'Execution time',
        'value': ' Fri May 01 2020 - 01:20:05 GMT+0000 (Coordinated Universal Time)'
      },
      {
        'inline': false,
        'name': '​',
        'value': '​'
      },
      {
        'inline': false,
        'name': 'say xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'value': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
      }
    ]);
  });
});
