const LoggingObject = require('../LoggingObject');
const EventSource = require('eventsource');
const handleLogLine = require('../../../../worker/processors/logs/handleLogLine');

class SdtdSSE extends LoggingObject {
  constructor(server) {
    super(server);
    this.SSERegex = /\d+-\d+-\d+T\d+:\d+:\d+ \d+\.\d+ INF (.+)/;
  }


  async start() {
    if (process.env.SSE_ENABLED !== 'true') {
      throw new Error('SSE is disabled on this instance. To enable SSE, ask your CSMM server admin to set SSE_ENABLED to true in the environment variables.');
    }

    this.eventSource = new EventSource(`http://${this.server.ip}:${this.server.webPort}/sse/log?adminuser=${this.server.authName}&admintoken=${this.server.authToken}`);
    this.eventSource.reconnectInterval = 30000;
    this.eventSource.addEventListener('logLine', async data => {
      try {
        const parsed = JSON.parse(data.data);
        const messageMatch = this.SSERegex.exec(parsed.msg);
        if (messageMatch && messageMatch[1]) {
          parsed.msg = messageMatch[1];
        }
        const log = handleLogLine(parsed);
        if (log) {
          await this.handleMessage(log);
        }
      } catch (error) {
        sails.log.error(error.stack);
      }

    });
    this.eventSource.onerror = e => {
      sails.log.warn(`SSE error for server ${this.server.id}`);
      sails.log.warn(e);
    };
    this.eventSource.onopen = () => {
      sails.log.debug(`Opened a SSE channel for server ${this.server.id}`);
    };
  }

  async destroy() {
    if (!this.eventSource) {
      return;
    }

    this.eventSource.close();
  }
}

module.exports = SdtdSSE;
