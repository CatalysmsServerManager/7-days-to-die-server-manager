/**
 * Executes a function no more than amount times per minutes with sliding window
 * @param {Function} listener
 * @param {Number} amount
 */
function throttledFunction(listener, amount, minutes) {
  const buckets = {};

  function incrBucket() {
    const date = new Date();
    date.setUTCMilliseconds(0);
    date.setUTCSeconds(0);

    if (!buckets[date.toISOString()]) {
      buckets[date.toISOString()] = 0;
      const keys = Object.keys(buckets);

      keys
        .filter(d => {
          return new Date(d) < date.getTime() - minutes * 60 * 1000;
        })
        .forEach(keyToDelete => {
          delete buckets[keyToDelete];
        });
    }

    buckets[date.toISOString()]++;
  }


  return (data) => {
    incrBucket();
    const sum = Object.values(buckets).reduce((sum, amount) => sum + amount, 0);
    if (sum > amount) {
      sails.log.warn(`Discarding an event buckets: ${JSON.stringify(buckets)}  event: ${JSON.stringify(data)}`, {labels: {namespace: 'throttledFunction'}});
      return;
    }
    listener(data);
  };
}

module.exports = throttledFunction;
