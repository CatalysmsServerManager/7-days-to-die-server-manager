class sdtdConsole {
  constructor(serverId) {
    this.serverId = serverId;
    this.start()
  }

  start() {
    this.status = true;
    $(".console-window").empty();
    io.socket.get('/sdtdserver/' + this.serverId + '/socket', function (response) { });
    io.socket.on('logLine', (logLine) => {
      if (logLine.server.id === this.serverId) {
        addNewLogLine(logLine.msg)
      }
    });
    addSavedMessagesToConsoleWindow(this.serverId)
  }

  stop() {
    this.status = false;
    io.socket.off('logLine', (logLine) => {

    });
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
          addNewLogLine(data.msg);
          resolve(data);
        },
        error: (xhr, status, error) => {
          addNewLogLine(error)
          reject(error);
        }
      });
    });
  }

}

function addNewLogLine(logLine) {
  if (_.isUndefined(logLine)) {
    return
  }

  if (logLine.includes('WebCommandResult.SendLines():') || logLine.includes('WebCommandResult_for_')) {
    return
  }

  logLine = _.escape(logLine)
  logLine = logLine.replace(/(\r\n|\n|\r)/gm, "<br />");

  if (logLine.includes("error")) {
    $('.console-window').append(`<li class=\"log-line text-danger\"> ${logLine} </li>`);
  } else {
    $('.console-window').append(`<li class=\"log-line\"> ${logLine} </li>`);
  }
  updateConsoleStorage(logLine, this.serverId);
  $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
}




function updateConsoleStorage(newMessage, serverId) {
  let storage = window.localStorage
  let savedMessages = JSON.parse(storage.getItem(`consoleMessages-${serverId}`));
  if (!savedMessages) {
    savedMessages = new Array('Starting console');
  }

  if (savedMessages.length > 50) {
    savedMessages.shift();
  }

  savedMessages.push(newMessage);
  storage.setItem(`consoleMessages-${serverId}`, JSON.stringify(savedMessages));
}

function addSavedMessagesToConsoleWindow(serverId) {
  let savedMessages = JSON.parse(window.localStorage.getItem(`consoleMessages-${serverId}`));
  if (savedMessages) {
    savedMessages.forEach(msg => {
      addNewLogLine(msg)
    })
    $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
  }
}