module.exports = {

    attributes: {

        name: {
            type: 'string',
            required: true
        },

        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        server: {
            model: 'sdtdserver',
            required: true
        },

        tier: {
            model: 'banneditemtier',
            required: true
        },

    },

};
