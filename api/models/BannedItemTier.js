module.exports = {

    attributes: {

        command: {
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

        role: {
            model: 'role',
            required: true
        },

    },

};
