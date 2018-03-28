class sdtdConsole {
  constructor(serverId) {
    this.serverId = serverId;
    this.addNewLogLine = addNewLogLine.bind(this)
    this.start()
  }

  start() {
    this.status = true;
    $(".console-window").empty();
    io.socket.get('/sdtdserver/' + this.serverId + '/socket', function (response) { });
    io.socket.on('logLine', this.addNewLogLine);
    addSavedMessagesToConsoleWindow(this.serverId)
  }

  stop() {
    this.status = false;
    io.socket.off('logLine', this.addNewLogLine);
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


function addNewLogLine(logLine) {
  if(logLine.msg.includes('WebCommandResult.SendLines():') || logLine.msg.includes('WebCommandResult_for_')) {
    return 
  }

  logLine.msg = logLine.msg.replace(/(\r\n|\n|\r)/gm, "<br />");

  if (logLine.msg.includes("error")) {
    $('.console-window').append('<li class=\"log-line text-danger\">' + logLine.msg + '</li>');
  } else {
    $('.console-window').append(`<li class=\"log-line\"> ${logLine.msg} </li>`);
  }
  updateConsoleStorage(logLine.msg, this.serverId);
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
      if (msg.includes("error")) {
        $('.console-window').append('<li class=\"log-line text-danger\">' + msg + '</li>');
      } else {
        $('.console-window').append(`<li class=\"log-line\"> ${msg} </li>`);
      }
    })
    $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
  }
}