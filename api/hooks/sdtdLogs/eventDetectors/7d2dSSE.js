const LoggingObject = require('../LoggingObject');
const EventSource = require('eventsource');
const handleLogLine = require('../../../../worker/processors/logs/handleLogLine');

class SdtdSSE extends LoggingObject {
  constructor(server) {
    super(server);
    this.SSERegex = /\d+-\d+-\d+T\d+:\d+:\d+ \d+\.\d+ INF (.+)/;
    this.listener = this.SSEListener.bind(this);
    this.queuedChatMessages = [];
  }


  async start() {
    this.eventSource = new EventSource(`http://${this.server.ip}:${this.server.webPort}/sse/log?adminuser=${this.server.authName}&admintoken=${this.server.authToken}`);
    this.eventSource.reconnectInterval = 30000;
    this.eventSource.addEventListener('logLine', this.listener);
    this.eventSource.onerror = e => {
      sails.log.warn(`SSE error for server ${this.server.id}`);
      if (e.message) {
        sails.log.warn(e.message);
      }
    };
    this.eventSource.onopen = () => {
      sails.log.debug(`Opened a SSE channel for server ${this.server.id}`);
    };
  }

  async destroy() {
    if (!this.eventSource) {
      return;
    }
    this.eventSource.removeEventListener(this.listener);
    this.eventSource.close();
  }

  async SSEListener(data) {
    try {
      const parsed = JSON.parse(data.data);
      const messageMatch = this.SSERegex.exec(parsed.msg);
      if (messageMatch && messageMatch[1]) {
        parsed.msg = messageMatch[1];
      }
      const log = handleLogLine(parsed);
      if (log) {
        if (log.type === 'chatMessage' || log.data.msg.includes('-non-player-')) {
          return this.pushChatMessage(log);
        }

        await this.handleMessage(log);
      }
    } catch (error) {
      sails.log.error(error.stack);
    }
  }

  /**
   * When a mod intercepts a chat message, it will send out two messages
   * One is the original chat message
   * and the other is the modified message
   * The modified message is not interesting to us, so we should ignore it
   * The original message will include all the data we need (steamId, chat text, ...)
   */
  async pushChatMessage(chatMessage) {
    const previouslyQueued = this.queuedChatMessages[this.queuedChatMessages.length - 1];
    if (previouslyQueued) {
      if (previouslyQueued.data.messageText === chatMessage.data.messageText) {
        previouslyQueued.type = 'logLine';
      }
      await this.handleMessage(previouslyQueued);
      await this.handleMessage(chatMessage);
      this.queuedChatMessages = [];
    } else {
      this.queuedChatMessages.push(chatMessage);
      // If a chatmessage does not get handled by a mod, we still need some way to react to it
      // This is achieved by setting a timeout
      // If no messages comes in before the timeout, it will send out the original chat message
      this.chatMsgLock = setTimeout(() => {
        const previouslyQueued = this.queuedChatMessages[this.queuedChatMessages.length - 1];
        this.queuedChatMessages = [];
        if (previouslyQueued) {
          return this.handleMessage(previouslyQueued);
        }
      }, 250);
    }
  };


}

module.exports = SdtdSSE;
