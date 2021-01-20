const opentelemetry = require('@opentelemetry/api');
const { NodeTracerProvider } = require('@opentelemetry/node');
const { BatchSpanProcessor } = require('@opentelemetry/tracing');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

let tracer;

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
  loadTracer() {
    if (tracer) {
      return tracer;
    }
    // Load Tracer integration only if required env vars are set
    if (process.env.JAEGER_ENDPOINT) {
      console.log(`Loading tracing integration, sending data to agent at ${process.env.JAEGER_ENDPOINT}`);



      const provider = new NodeTracerProvider({
        logger: require('../config/customLog').customLogger
      });

      const exporter = new JaegerExporter({
        serviceName: 'CSMM',
        endpoint: process.env.JAEGER_ENDPOINT,

      });
      provider.addSpanProcessor(new BatchSpanProcessor(exporter));
      provider.register();
      tracer = opentelemetry.trace.getTracer('CSMM');
      return tracer;
    }
  },
  tracerWrapper(fnToWrap) {
    if (!tracer) {
      return fnToWrap;
    }

    return async (...args) => {
      // Somethings wrong here, it cannot create child spans properly for some reason...
      // Likely something to do with scoping?
      // Or this wrapper approach is too naive
      const ctx = opentelemetry.context.active();
      const currentSpan = opentelemetry.getActiveSpan(ctx);
      const spanName = fnToWrap.name ? fnToWrap.name : 'Anonymous';
      const span = tracer.startSpan(spanName, currentSpan);
      const res = await fnToWrap(...args);
      span.end();
      return res;

    };
  }
};
