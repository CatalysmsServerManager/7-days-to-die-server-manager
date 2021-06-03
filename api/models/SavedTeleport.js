module.exports = {

    attributes: {

        x: {
            type: 'number',
            required: true
        },

        y: {
            type: 'number',
            required: true
        },

        z: {
            type: 'number',
            required: true
        },

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
    },

};
