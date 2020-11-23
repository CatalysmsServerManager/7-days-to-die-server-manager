module.exports = {
  classToHook(obj, exposedFunctions = ['start', 'stop']) {
    function getMethods(o) {
      return Object.getOwnPropertyNames(Object.getPrototypeOf(o))
        .filter(m => 'function' === typeof o[m]);
    }
    return getMethods(obj).filter(m => m !== 'constructor').reduce(function (ret, method) {
      if (exposedFunctions.includes(method)) {
        ret[method] = obj[method].bind(obj);
      } else {
        ret[method] = obj[method];
      }
      return ret;
    }, {});
  },
  loadDatadog() {
    // Load Datadog integration only if required env vars are set
    if (process.env.DD_AGENT_HOST && process.env.DD_TRACE_AGENT_PORT) {
      console.log(`Loading datadog integration, sending data to agent at ${process.env.DD_AGENT_HOST} && ${process.env.DD_TRACE_AGENT_PORT}`);
      return require('dd-trace').init({
        profiling: true,
        logInjection: true
      });
    }
  }
};
