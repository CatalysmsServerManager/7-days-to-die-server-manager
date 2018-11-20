const SdtdApi = require('7daystodie-api-wrapper');
const EventEmitter = require('events');
const handleLogLine = require('./handleLogLine');

class LoggingObject extends EventEmitter {

  constructor(ip, port, authName, authToken, intervalTime = 2000) {
    super();
    this.server = {
      ip: ip,
      port: port,
      adminUser: authName,
      adminToken: authToken,
    };
    this.intervalTime = intervalTime;
    this.requestInterval;
    this.init();
  }

  async init() {
    // Get the latest log line
    let webUIUpdate = await SdtdApi.getWebUIUpdates(this.server);
    let lastLogLine = webUIUpdate.newlogs;

    // Get new logs in a timed interval
    this.requestInterval = setInterval(async () => {
      let newLogs = await SdtdApi.getLog(this.server, lastLogLine);
      
      _.each(newLogs.entries, line => {
        console.log(line);
        let parsedLogLine = handleLogLine(line);

        this.emit(parsedLogLine.type, parsedLogLine.data);

      });

      lastLogLine = newLogs.lastLine;
    }, this.intervalTime)

  }



}

module.exports = LoggingObject;
