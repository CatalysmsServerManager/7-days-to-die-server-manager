class sdtdChat {
  constructor(serverId) {
    this.serverId = serverId;
    this.start();
  }


  start() {
    console.log('Starting chat for server with id ' + this.serverId);

    io.socket.get('/sdtdserver/' + this.serverId + '/socket', function (response) {
      console.log('Subscribed to socket ' + response);
    });
    io.socket.on('chatMessage', addNewChatMessage);
    addSavedMessagesToChatWindow();
  }

  stop() {
    io.socket.removeListener('chatMessage', addNewChatMessage);
  }

  sendMessage(message, username) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: `/api/sdtdserver/sendMessage`,
        data: {
          serverId: this.serverId,
          message: `${username}: ${message}`
        },
        success: (data, status, xhr) => {
          resolve(data);
        },
        error: (xhr, status, error) => {
          $('.chat-window').append('<li class=\"chat-message text-danger\">' + error + '</li>');
          resolve(error);
        }
      });
    });
  }
}

function addNewChatMessage(chatMessage) {

  if (chatMessage.playerName == 'Server') {
    $('.chat-window').append(`<li class=\"chat-message\">[${chatMessage.time}] ${chatMessage.messageText} </li>`);
    addMessageToStorage(`[${chatMessage.time}] ${chatMessage.messageText}`)

  } else {
    $('.chat-window').append(`<li class=\"chat-message\">[${chatMessage.time}] ${chatMessage.playerName}: ${chatMessage.messageText} </li>`);
    addMessageToStorage(`[${chatMessage.time}] ${chatMessage.playerName}: ${chatMessage.messageText}`)
  }
  $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);

}

function addMessageToStorage(newMessage) {
  let storage = window.localStorage
  let savedMessages = JSON.parse(storage.getItem('chatMessages'));

  if (!savedMessages) {
    savedMessages = new Array('Starting chat');
  }

  if (savedMessages.length > 50) {
    savedMessages.shift();
  }

  savedMessages.push(newMessage);
  storage.setItem('chatMessages', JSON.stringify(savedMessages));
}

function addSavedMessagesToChatWindow() {
  let savedMessages = JSON.parse(window.localStorage.getItem('chatMessages'));
  if (savedMessages) {
    savedMessages.forEach(msg => {
      $('.chat-window').append(`<li class=\"chat-message\">${msg} </li>`);
    })
  }
  $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);
}