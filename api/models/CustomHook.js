module.exports = {

  afterCreate: function (newHook, cb) {

    if (newHook.event === 'logLine') {
      let currentHooks = sails.hooks.customhooks.logLineHooks.get(newHook.server);

      if (!_.isArray(currentHooks)) {
        currentHooks = [];
      };
      currentHooks.push(newHook);

      sails.hooks.customhooks.logLineHooks.set(String(newHook.server), currentHooks);
    }

    return cb();
  },

  afterUpdate: function (newHook, cb) {

    if (newHook.event === 'logLine') {
      let currentHooks = sails.hooks.customhooks.logLineHooks.get(newHook.server);

      if (!_.isArray(currentHooks)) {
        currentHooks = [];
      };

      _.remove(currentHooks, (h) => {
        return h.id === newHook.id;
      });

      currentHooks.push(newHook);

      sails.hooks.customhooks.logLineHooks.set(String(newHook.server), currentHooks);
    }

    return cb();
  },

  beforeDestroy: function (deletedHook, cb) {

    if (deletedHook.event === 'logLine') {
      let currentHooks = sails.hooks.customhooks.logLineHooks.get(deletedHook.server);
      _.remove(currentHooks, (h) => {
        return h.id === deletedHook.id;
      });

      sails.hooks.customhooks.logLineHooks.set(String(deletedHook.server), currentHooks);
    }

    return cb();
  },

  attributes: {

    // What event will trigger this hook
    event: {
      required: true,
      type: 'string',
      isIn: sails.config.custom.supportedHooks
    },

    commandsToExecute: {
      required: true,
      type: 'string'
    },

    searchString: {
      type: 'string'
    },

    regex: {
      type: 'string'
    },

    cooldown: {
      type: 'number',
      min: 0,
      defaultsTo: 0
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

    variables: {
      collection: 'hookvariable',
      via: 'hook'
    },

  },

};
