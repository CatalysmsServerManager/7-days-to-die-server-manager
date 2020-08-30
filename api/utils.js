module.exports = {
  classToHook(obj) {
    function getMethods(o) {
      return Object.getOwnPropertyNames(Object.getPrototypeOf(o))
        .filter(m => 'function' === typeof o[m]);
    }
    return getMethods(obj).filter(m => m !== 'constructor').reduce(function(ret, method) {
      ret[method] = obj[method];
      return ret;
    }, {});
  }
};
