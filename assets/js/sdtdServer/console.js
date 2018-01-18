class sdtdConsole {
  constructor(serverId) {
    this.serverId = serverId;
  }

  start() {

    io.socket.get('/sdtdserver/' + this.serverId + '/socket', function (response) {});

    io.socket.on('logLine', function addNewLogLine(logLine) {
      if (logLine.msg.includes("error")) {
        $('.console-window').append('<li class=\"log-line text-danger\">' + logLine.msg + '</li>');
      } else {
        $('.console-window').append('<li class=\"log-line\">' + logLine.msg + '</li>');
      }

      $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
    });
  }

  stop() {
    io.socket.removeListener('logLine', addNewLogLine);
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/sdtdserver/executeCommand`,
        data: {
          serverId: this.serverId,
          command: command
        },
        success: (data, status, xhr) => {
          resolve(data);
        },
        error: (xhr, status, error) => {
          reject(error);
        }
      });
    });
  }
}
