/**
 * Executes a function no more than amount times per minutes with sliding window
 * @param {Function} listener
 * @param {Number} amount
 */
function throttledFunction(listener, amount, minutes) {
  const buckets = {};

  function incrBucket() {
    const date = new Date();
    const minute = date.getMinutes();
    if (!buckets[minute]) {
      buckets[minute] = 0;
      const keys = Object.keys(buckets).map(k => parseInt(k, 10));
      if (Math.max(...keys) - Math.min(...keys) > minutes ) {
        const oldest = keys.sort((a, b) => a - b)[0];
        delete buckets[oldest];
      }
    }

    buckets[minute]++;
  }


  return (data) => {
    incrBucket();
    const sum = Object.values(buckets).reduce((sum, bucket) => sum + bucket, 0);
    if (sum > amount) {
      return;
    }
    listener(data);
  };
}

module.exports = throttledFunction;
