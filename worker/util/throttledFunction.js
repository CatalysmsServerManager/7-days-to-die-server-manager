const EventEmitter = require('events');
const redis = require('redis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = redis.createClient(process.env.REDISSTRING, { enable_offline_queue: false });

/**
 * Executes a function no more than amount times per minutes with sliding window
 * @param {Function} listener
 * @param {Number} amount
 */
class ThrottledFunction extends EventEmitter {
  constructor(listener, amount, minutes, key = 'function') {
    super();

    this.key = key;
    this.amount = amount;
    this.minutes = minutes;
    this.lastState = 'normal';

    this.opts = {
      storeClient: redisClient,
      points: this.amount,
      duration: this.minutes * 60, // convert minutes to seconds

      execEvenly: false,
      blockDuration: 0,
      keyPrefix: 'rlflx',
    };

    this.rateLimiter = new RateLimiterRedis(this.opts);

    this.listener = (data) => {
      this.rateLimiter.consume(this.key)
        .then(() => {
          if (this.lastState === 'throttled') {
            this.emit('normal');
            this.lastState = 'normal';
          }
          listener(data); // call the original listener
        })
        .catch((rejRes) => {
          if (rejRes instanceof Error) {
            // Handle the Redis error accordingly
            sails.log.error('Redis Error:', rejRes);
          } else {
            if (this.lastState === 'normal') {
              this.emit('throttled');
              this.lastState = 'throttled';
            }
          }
        });
    };
  }
}

module.exports = ThrottledFunction;
