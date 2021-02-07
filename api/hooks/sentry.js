const os = require('os');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');

module.exports = function SentryHook(sails) {
  return {
    /**
     * Default configuration
     *
     * We do this in a function since the configuration key for
     * the hook is itself configurable, so we can't just return
     * an object.
     */
    defaults: {
      __configKey__: {
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        serverName: process.env.CSMM_HOSTNAME || os.hostname(),
        release: require('../../package.json').version,
        tracesSampleRate: 0.01,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Tracing.Integrations.Express({ app: sails }),
          new Tracing.Integrations.Mysql()
        ]
      }
    },

    /**
     * Initialize the hook
     * @param  {Function} cb Callback for when we're done initializing
     * @return {Function} cb Callback for when we're done initializing
     */
    initialize: function (cb) {
      var settings = sails.config[this.configKey];

      if (!settings.dsn) {
        sails.log.verbose('DSN for Sentry is required.');
        return cb();
      }


      const { getCurrentHub } = require('@sentry/core');
      const { Severity } = require('@sentry/types');
      const util = require('util');

      Sentry.init(settings);
      Sentry.configureScope(function (scope) {
        scope.setTag('workerProcess', process.env.npm_lifecycle_event || 'sails');
      });

      sails.sentry = Sentry;

      const origServerError = sails.hooks.responses.middleware.serverError;
      sails.hooks.responses.middleware.serverError = function (err) {
        Sentry.captureException(err);
        origServerError.bind(this)(...arguments);
      };

      for (const level of Object.keys(sails.log)) {
        switch (level) {
          case 'verbose':
          case 'silly':
          case 'blank':
          case 'ship':
            continue;

          case 'debug':
            sentryLevel = Severity.Debug;
            break;
          case 'crit':
          case 'error':
            sentryLevel = Severity.Error;
            break;
          case 'info':
            sentryLevel = Severity.Info;
            break;
          case 'warn':
            sentryLevel = Severity.Warning;
            break;
          default:
            throw new Error('not sure what to do with ' + level);
        }
        const origFunction = sails.log[level].bind(sails.log);
        sails.log[level] = function () {
          getCurrentHub().addBreadcrumb(
            {
              category: 'sailslog',
              level: sentryLevel,
              message: util.format.apply(undefined, arguments),
              data: { ...arguments }
            },
            {
              input: [...arguments],
              level,
            },
          );
          origFunction(...arguments);
        };
      }

      // handles Bluebird's promises unhandled rejections
      process.on('unhandledRejection', function (reason) {
        console.error('Unhandled rejection:', reason);
        Sentry.captureException(reason);
      });

      // We're done initializing.
      return cb();
    },

    wrapFn: function wrapFn(fn) {
      return async function () {
        const transaction = Sentry.startTransaction({
          op: 'wrapped',
          name: fn.name,
        });

        Sentry.configureScope(scope => {
          scope.setSpan(transaction);
        });

        return fn.apply(this, arguments, transaction).then(returnVal => {
          transaction.finish();
          return returnVal;
        });

      };
    }
  };
};
