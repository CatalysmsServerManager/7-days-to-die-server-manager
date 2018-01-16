var sails = require('sails');
var selenium = require('selenium-standalone');

module.exports = {
  bootstrap: function (done) {
    return sails.lift({
      // Your sails app's configuration files will be loaded automatically,
      // but you can also specify any other special overrides here for testing purposes.

      // For example, we might want to skip the Grunt hook,
      // and disable all logs except errors and warnings:
      hooks: {
        grunt: false
      },
      log: {
        level: 'warn'
      },
      // Clean out DB before running tests
      models: {
        migrate: 'drop'
      },
      port: 1337
    }, async function (err) {
      if (err) {
        return done(err);
      }
      // here you can load fixtures, etc.
      // (for example, you might want to create some records in the database)
      try {
        await installSelenium()
        sails.seleniumServer = await startSelenium()
        return done()
      } catch (error) {
        done(error)
      }

    });
  },

  teardown: async function (done) {
    try {
      await sails.seleniumServer.kill();
    } catch (error) {
      done(error)
    }

  }
}





function installSelenium() {
  return new Promise((resolve, reject) => {
    selenium.install({
      version: '3.0.1',
      baseURL: 'https://selenium-release.storage.googleapis.com',
      drivers: {
        chrome: {
          version: '2.31',
          arch: process.arch,
          baseURL: 'https://chromedriver.storage.googleapis.com'
        }
      },
      requestOpts: { // see https://github.com/request/request#requestoptions-callback
        timeout: 10000
      },
      logger: function (message) {
        sails.log.warn(message);
      },
      progressCb: function (totalLength, progressLength, chunkLength) {

      }
    }, resolve)
  })
}

function startSelenium() {
  return new Promise((resolve, reject) => {
    selenium.start({
      version: '3.0.1',
      drivers: {
        chrome: {
          version: '2.31',
          arch: process.arch,
          baseURL: 'https://chromedriver.storage.googleapis.com'
        }
      },
      baseURL: 'https://selenium-release.storage.googleapis.com'
    }, (err, child) => {
      if (err) {
        return reject(err)
      }
      resolve(child)
    })
  })
}
