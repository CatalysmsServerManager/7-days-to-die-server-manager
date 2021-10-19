/**
 * Executes a function no more than amount times per minutes with sliding window
 * @param {Function} listener
 * @param {Number} amount
 */
function throttledFunction(listener, amount, minutes) {
  const buckets = {};

  function incrBucket() {

    const date = new Date();
    const minute = String(date.getMinutes()).padStart(2, '0');
    const hour = date.getHours();
    if (!buckets[`${hour}${minute}`]) {
      buckets[`${hour}${minute}`] = 0;
      const keys = Object.keys(buckets).map(k => parseInt(k, 10));
      if (Math.max(...keys) - Math.min(...keys) >= minutes ) {
        const oldest = keys.sort((a, b) => a - b)[0];
        delete buckets[oldest];
      }
    }

    buckets[`${hour}${minute}`]++;

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
