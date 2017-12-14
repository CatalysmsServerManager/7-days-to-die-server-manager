/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {


    //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
    //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
    //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` your home page.            *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'homepage'
    },

    '/about': {
        view: 'about'
    },

    '/auth/steam': {
        controller: 'AuthController',
        action: 'steamLogin'
    },

    '/auth/steam/return': {
        controller: 'AuthController',
        action: 'steamReturn'
    },

    '/auth/logout': {
        controller: 'AuthController',
        action: 'logout'
    },

    /***************************************************************************
     *                                                                          *
     * More custom routes here...                                               *
     * (See https://sailsjs.com/config/routes for examples.)                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the routes in this file, it   *
     * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
     * not match any of those, it is matched against static assets.             *
     *                                                                          *
     ***************************************************************************/

    'get /welcome': {
        controller: 'UserController',
        action: 'welcome'
    },

    'get /sdtdserver/:serverID/subscribetosocket': {
        controller: 'SdtdServerController',
        action: 'subscribeToServerSocket'
    },

    'get /sdtdserver/addserver': {
        view: 'sdtdServer/addserver',
        locals: {
            telnetError: ""
        }
    },


    '/sdtdserver/:serverID/dashboard/': {
        controller: 'SdtdServerController',
        action: 'dashboard',
        skipAssets: true
    },

    '/sdtdserver/:serverID/console/': {
        controller: 'SdtdServerController',
        action: 'console',
        skipAssets: false
    },

    '/sdtdserver/:serverID/executeCommand': {
        controller: 'SdtdServerController',
        action: 'executeCommand'
    },

    //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
    //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
    //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝

    'post /api/sdtdserver/addserver': {
        controller: 'SdtdServerController',
        action: 'addserver'
    },

    'get /api/sdtdserver/onlinePlayers': {
        controller: 'SdtdServerController',
        action: 'onlinePlayers'
    },

    'get /api/user/ownedServers': {
        controller: 'User',
        action: 'ownedServers',
        skipAssets: true
    },

    'get /api/sdtdserver/info': {
        controller: 'SdtdServer',
        action: 'getServerInfo',
        skipAssets: true
    },

    'get /api/sdtdserver/players': {
        controller: 'SdtdServer',
        action: 'getPlayers',
        skipAssets: true
    },


    //  ╦ ╦╔═╗╔╗ ╦ ╦╔═╗╔═╗╦╔═╔═╗
    //  ║║║║╣ ╠╩╗╠═╣║ ║║ ║╠╩╗╚═╗
    //  ╚╩╝╚═╝╚═╝╩ ╩╚═╝╚═╝╩ ╩╚═╝

    'get /sdtdserver/:serverID/socket': {
        controller: 'sdtdServerController',
        action: 'subscribeToServerSocket'
    }


    //  ╔╦╗╦╔═╗╔═╗
    //  ║║║║╚═╗║
    //  ╩ ╩╩╚═╝╚═╝


};