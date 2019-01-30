module.exports = {

  attributes: {

    // memUpdate info

    fps: {
      type: 'number',
      allowNull: true
    },

    heap: {
      type: 'number',
      allowNull: true
    },

    chunks: {
      type: 'number',
      allowNull: true
    },

    zombies: {
      type: 'number',
      allowNull: true
    },

    entities: {
      type: 'number',
      allowNull: true
    },

    players: {
      type: 'number',
      allowNull: true
    },

    items: {
      type: 'number',
      allowNull: true
    },

    rss: {
      type: 'number',
      allowNull: true
    },

    uptime: {
      type: 'number',
      allowNull: true
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

    server: {
      model: 'sdtdserver',
      required: true
    },

  },

};
