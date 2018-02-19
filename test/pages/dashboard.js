
'use strict';

let I;

module.exports = {

  _init() {
    I = require('../features/steps_file.js')();
  },

  fields: {
    consoleCommand: '#consoleCommand',
    chatMessage: '#chat-message-input'
  },

  buttons: {
    consoleSend: '#execCommand',
    consolePause: '#console-pause',
    consoleClear: '#clearConsole',
    chatSend: '#send-message',
    chatClear: '#clearChat',
  },

  sendChatMessage(message) {
    I.fillField(this.fields.chatMessage, message);
    I.click(this.buttons.chatSend)
  },

  sendConsoleCommand(command) {
    I.fillField(this.fields.consoleCommand, command);
    I.click(this.buttons.consoleSend)
  }
}

