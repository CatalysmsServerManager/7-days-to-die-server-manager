
module.exports = {

  attributes: {


    name: {
      type: 'string',
      required: true
    },

    amount: {
      type: 'number',
      defaultsTo: 1,
      min: 1
    },


    quality: {
      type: 'number',
      defaultsTo: 0,
      min: 0
    },

    player: {
      model: 'player',
      required: true,
    },

    claimed: {
      type: 'boolean',
      defaultsTo: false
    }


  },

};
