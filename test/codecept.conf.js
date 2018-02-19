  // Load env vars
  require('dotenv').config();

  exports.config = {
    tests: "./features/**/*.test.js",
    timeout: 10000,
    output: "./output",
    helpers: {
      WebDriverIO: {
        url: process.env.CSMM_HOSTNAME,
        browser: "chrome",
        desiredCapabilities: {
          chromeOptions: {
            args: ["--headless", "--disable-gpu", "--window-size=800,600"]
          }
        }
      }
    },
    include: {
      I: "./features/steps_file.js",
      dashboardPage: './pages/dashboard.js'
    },
    bootstrap: "./features/lifecycle.js",
    teardown: "./features/lifecycle.js",
    mocha: {},
    name: "test"
  }
