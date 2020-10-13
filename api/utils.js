module.exports = {
  classToHook(obj, exposedFunctions = ['start', 'stop']) {
    function getMethods(o) {
      return Object.getOwnPropertyNames(Object.getPrototypeOf(o))
        .filter(m => 'function' === typeof o[m]);
    }
    return getMethods(obj).filter(m => m !== 'constructor').reduce(function(ret, method) {
      if (exposedFunctions.includes(method)) {
        ret[method] = obj[method].bind(obj);
      } else {
        ret[method] = obj[method];
      }
      return ret;
    }, {});
  }
};
