const EventEmitter = require('events');
/**
 * Executes a function no more than amount times per minutes with sliding window
 * @param {Function} listener
 * @param {Number} amount
 */
class ThrottledFunction extends EventEmitter {
  constructor(listener, amount, minutes) {
    super();
    this.amount = amount;
    this.minutes = minutes;
    this.buckets = {};
    this.lastState = 'normal';
    this.listener = (data) => {
      this.incrBucket();
      const sum = Object.values(this.buckets).reduce((sum, amount) => sum + amount, 0);
      if (sum > this.amount) {
        sails.log.warn(`Discarding an event`, {labels: {namespace: 'throttledFunction'}, bucket: this.buckets, event: data});

        if (this.lastState === 'normal') {
          this.emit('throttled', {buckets: this.buckets});
          this.lastState = 'throttled';
        }

        return;
      }

      if (this.lastState === 'throttled') {
        this.emit('normal', {buckets: this.buckets});
        this.lastState = 'normal';
      }
      listener(data);
    };
  }

  incrBucket() {
    const date = new Date();
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);

    if (!this.buckets[date.toISOString()]) {
      this.buckets[date.toISOString()] = 0;
      const keys = Object.keys(this.buckets);

      keys
        .filter(d => {
          return new Date(d) < date.getTime() - this.minutes * 60 * 1000;
        })
        .forEach(keyToDelete => {
          delete this.buckets[keyToDelete];
        });
    }

    this.buckets[date.toISOString()]++;
  }

}

module.exports = ThrottledFunction;
