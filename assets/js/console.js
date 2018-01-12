class sdtdConsole {
  constructor(serverId) {
    this.serverId = serverId
  }

  start() {
    console.log("Starting console for server with id " + this.serverId);

    io.socket.get('/sdtdserver/' + this.serverId + '/subscribetosocket', function (response) {
      console.log("Subscribed to socket " + response);
    });

    io.socket.on('logLine', function addNewLogLine(logLine) {
      $('.console-window').append('<li class=\"log-line\">' + logLine.msg + '</li>');
      $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
    });
  }

  stop() {
    io.socket.removeListener('logLine', addNewLogLine)
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/sdtdserver/${this.serverId}/executeCommand`,
        data: {
          command: command
        },
        success: (data, status, xhr) => {
          resolve(data)
        },
        error: (xhr, status, error) => {
          reject(error)
        }
      })
    })
  }
}
