// eslint-disable-next-line no-unused-vars
class sdtdConsole {
  constructor(serverId) {
    this.serverId = parseInt(serverId);
    this.status = true;
    this.init();
  }

  init() {
    $('.console-window').empty();

    io.socket.on('logLine', (logLine) => {
      if (logLine.server.id === this.serverId && this.status) {
        addNewLogLine(logLine.msg);
      }
    });
    addSavedMessagesToConsoleWindow(this.serverId);
  }

  start() {
    this.status = true;

  }

  stop() {
    this.status = false;
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/sdtdserver/executeCommand`,
        method: 'post',
        data: {
          serverId: this.serverId,
          command: command,
          _csrf: window.SAILS_LOCALS._csrf
        },
        success: (data) => {
          addNewLogLine(data.msg);
          resolve(data);
        },
        error: function (xhr, status, error) {
          showErrorModal(`${error} - ${xhr.responseText}`, xhr);
          reject(error);
        }
      });
    });
  }

}

function addNewLogLine(logLine) {
  if (_.isUndefined(logLine)) {
    return;
  }

  if (logLine.includes('WebCommandResult.SendLines():') || logLine.includes('WebCommandResult_for_')) {
    return;
  }

  logLine = _.escape(logLine);
  logLine = logLine.replace(/(\r\n|\n|\r)/gm, '<br />');

  if (logLine.includes('error')) {
    $('.console-window').append(`<li class=\"log-line text-danger\"> ${logLine} </li>`);
  } else {
    $('.console-window').append(`<li class=\"log-line\"> ${logLine} </li>`);
  }
  updateConsoleStorage(logLine, this.serverId);
  $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
}




function updateConsoleStorage(newMessage, serverId) {
  let storage = window.localStorage;
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
      addNewLogLine(msg);
    });
    $('.console-window').scrollTop($('.console-window')[0].scrollHeight);
  }
}
