const CronJob = require('../../../../../api/hooks/discordNotifications/notifications/cronJob.js');

describe('CronJob', function () {
  beforeEach(function() {
    this.channel = {
      send: sandbox.fake()
    };

    this.notification = new CronJob();
    this.notification.getDiscordChannel = () => Promise.resolve(this.channel);
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
        responses: [{ result: 'An error occurred executing the API request to the 7D2D server' } ]
      }
    });
    expect(this.channel.send.callCount).to.equal(1);
    expect(this.channel.send.getCall(0).args.length).to.eql(1);
    expect(this.channel.send.getCall(0).args[0]).to.have.all.keys('author','color','description','fields','file','files','footer','image','thumbnail','timestamp','title','url');
    expect(this.channel.send.getCall(0).args[0].fields).to.eql([
      {
        'inline': true,
        'name': 'Command',
        'value': 'say "[FAAC58]Merci de poser un bloc de revendication à l\'emplacement de votre base afin que celle-ci ne soit pas réinitialisé lors de la réinitialisation du lundi.[-]"'
      },
      {
        'inline': true,
        'name': 'Execution time',
        'value': ' Thu Apr 30 2020 - 18:20:05 GMT-0700 (Pacific Daylight Time)'
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
    expect(this.channel.send.callCount).to.equal(1);
    expect(this.channel.send.getCall(0).args.length).to.eql(1);
    expect(this.channel.send.getCall(0).args[0]).to.have.all.keys('author','color','description','fields','file','files','footer','image','thumbnail','timestamp','title','url');
    expect(this.channel.send.getCall(0).args[0].fields).to.eql([
      {
        'inline': true,
        'name': 'Command',
        'value': 'say my failed command'
      },
      {
        'inline': true,
        'name': 'Execution time',
        'value': ' Thu Apr 30 2020 - 18:20:05 GMT-0700 (Pacific Daylight Time)'
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
