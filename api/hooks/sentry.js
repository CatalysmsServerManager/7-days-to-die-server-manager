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

      this.wrapHelpers();

      // We're done initializing.
      return cb();
    },

    wrapHelpers: function wrapHelpers() {
      const iterate = (obj, prevKey) => {
        Object.keys(obj).forEach(key => {
          const value= obj[key];
          // This means we are dealing with a built action-as-machine from sails
          // We should wrap this!
          const name = prevKey ? `${prevKey}/${key}` : key;
          if (value.name === 'runFn') {
            obj[key] = this.wrapMachine(obj[key], {name,op:name });
          }

          if (typeof obj[key] === 'object') {
            iterate(obj[key], name);
          }
        });
      };

      iterate(sails.helpers);
    },

    wrapMachine: function wrapMachine(machine, options) {
      const resultFn = function () {

        const existingTransaction = Sentry.getCurrentHub()
          .getScope()
          .getTransaction();

        let transaction;
        const txOptions = {
          op: options.op || 'machine',
          name: options.name || fn.name || 'anonymous',
        };

        if (existingTransaction) {
          transaction = existingTransaction.startChild(txOptions);
        } else {
          transaction = Sentry.startTransaction(txOptions);
        }

        Sentry.configureScope(scope => {
          scope.setSpan(transaction);
        });
        transaction.setData('arguments', arguments);
        let res = machine(...arguments);

        if (res.then) {
          res = res.then(result => {
            transaction.finish();
            return result;
          });
        } else {
          transaction.finish();
        }

        return res;
      };

      // This is a sails action specific thing to allow passing args as object
      // A lot easier to do this than refactor all the usage of .with ...
      resultFn.with = machine.with;

      return resultFn;
    },

    wrapWorkerJob: function wrapWorkerJob(fn, options = {}) {
      return async function () {
        const transaction = Sentry.startTransaction({
          op: options.op || options.name || fn.name || 'anonymous',
          name: options.name || fn.name || 'anonymous',
        });
        transaction.setData('arguments', arguments);

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
