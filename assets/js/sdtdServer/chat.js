class sdtdChat {
  constructor(serverId) {
    this.serverId = serverId;
    this.addNewChatMessage = addNewChatMessage.bind(this);
    this.start();
  }


  start() {
    console.log('Starting chat for server with id ' + this.serverId);

    io.socket.get('/sdtdserver/' + this.serverId + '/socket', function (response) {
      console.log('Subscribed to socket ' + response);
    });
    io.socket.on('chatMessage', this.addNewChatMessage);
    addSavedMessagesToChatWindow(this.serverId);
  }

  stop() {
    io.socket.removeListener('chatMessage', this.addNewChatMessage);
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
    addMessageToStorage(`[${chatMessage.time}] ${chatMessage.messageText}`, this.serverId)

  } else {
    $('.chat-window').append(`<li class=\"chat-message\">[${chatMessage.time}] ${chatMessage.playerName}: ${chatMessage.messageText} </li>`);
    addMessageToStorage(`[${chatMessage.time}] ${chatMessage.playerName}: ${chatMessage.messageText}`, this.serverId)
  }
  $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);

}

function addMessageToStorage(newMessage, serverId) {
  let storage = window.localStorage
  let savedMessages = JSON.parse(storage.getItem(`chatMessages-${serverId}`));

  if (!savedMessages) {
    savedMessages = new Array('Starting chat');
  }

  if (savedMessages.length > 50) {
    savedMessages.shift();
  }

  savedMessages.push(newMessage);
  storage.setItem(`chatMessages-${serverId}`, JSON.stringify(savedMessages));
}

function addSavedMessagesToChatWindow(serverId) {
  let savedMessages = JSON.parse(window.localStorage.getItem(`chatMessages-${serverId}`));
  if (savedMessages) {
    savedMessages.forEach(msg => {
      $('.chat-window').append(`<li class=\"chat-message\">${msg} </li>`);
    })
  }
  $('.chat-window').scrollTop($('.chat-window')[0].scrollHeight);
}