/**
 * `tasks/config/sails-linker`
 *
 * ---------------------------------------------------------------
 *
 * Automatically inject <script> tags and <link> tags into the specified
 * specified HTML and/or EJS files.  The specified delimiters (`startTag`
 * and `endTag`) determine the insertion points.
 *
 * For more information, see:
 *   https://sailsjs.com/anatomy/tasks/config/sails-linker.js
 *
 */

const scriptFileRef = (filename) => `<%- scriptTag('${filename}') %>`;
const linkFileRef = (filename) => `<%- stylesheetTag('${filename}') %>`;
module.exports = function (grunt) {

  grunt.config.set('sails-linker', {


    //   ╦╔═╗╦  ╦╔═╗╔═╗╔═╗╦═╗╦╔═╗╔╦╗
    //   ║╠═╣╚╗╔╝╠═╣╚═╗║  ╠╦╝║╠═╝ ║
    //  ╚╝╩ ╩ ╚╝ ╩ ╩╚═╝╚═╝╩╚═╩╩   ╩
    //  ┌─    ┌─┐┬  ┬┌─┐┌┐┌┌┬┐  ┌─┐┬┌┬┐┌─┐   ┬┌─┐┬  ┬┌─┐┌─┐┌─┐┬─┐┬┌─┐┌┬┐    ─┐
    //  │───  │  │  │├┤ │││ │───└─┐│ ││├┤    │├─┤└┐┌┘├─┤└─┐│  ├┬┘│├─┘ │   ───│
    //  └─    └─┘┴─┘┴└─┘┘└┘ ┴   └─┘┴─┴┘└─┘  └┘┴ ┴ └┘ ┴ ┴└─┘└─┘┴└─┴┴   ┴     ─┘
    devJs: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public'
      },
      files: {
        '.tmp/public/**/*.html': require('../pipeline').jsFilesToInject,
        'views/**/*.html': require('../pipeline').jsFilesToInject,
        'views/**/*.sejs': require('../pipeline').jsFilesToInject
      }
    },

    devJsBuild: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public',
        relative: true
      },
      files: {
        '.tmp/public/**/*.html': require('../pipeline').jsFilesToInject,
      }
    },

    prodJs: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public'
      },
      files: {
        '.tmp/public/**/*.html': ['.tmp/public/min/production.min.js'],
        'views/**/*.html': ['.tmp/public/min/production.min.js'],
        'views/**/*.sejs': ['.tmp/public/min/production.min.js']
      }
    },

    prodJsBuild: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public',
        relative: true
      },
      files: {
        '.tmp/public/**/*.html': ['.tmp/public/min/production.min.js'],
      }
    },


    //  ╔═╗╔╦╗╦ ╦╦  ╔═╗╔═╗╦ ╦╔═╗╔═╗╔╦╗╔═╗
    //  ╚═╗ ║ ╚╦╝║  ║╣ ╚═╗╠═╣║╣ ║╣  ║ ╚═╗
    //  ╚═╝ ╩  ╩ ╩═╝╚═╝╚═╝╩ ╩╚═╝╚═╝ ╩ ╚═╝
    //  ┌─    ┬┌┐┌┌─┐┬  ┬ ┬┌┬┐┬┌┐┌┌─┐  ╔═╗╔═╗╔═╗   ┬   ┌─┐┌─┐┌┬┐┌─┐┬┬  ┌─┐┌┬┐  ╦  ╔═╗╔═╗╔═╗    ─┐
    //  │───  │││││  │  │ │ │││││││ ┬  ║  ╚═╗╚═╗  ┌┼─  │  │ ││││├─┘││  ├┤  ││  ║  ║╣ ╚═╗╚═╗  ───│
    //  └─    ┴┘└┘└─┘┴─┘└─┘─┴┘┴┘└┘└─┘  ╚═╝╚═╝╚═╝  └┘   └─┘└─┘┴ ┴┴  ┴┴─┘└─┘─┴┘  ╩═╝╚═╝╚═╝╚═╝    ─┘
    devStyles: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: linkFileRef,
        appRoot: '.tmp/public'
      },

      files: {
        '.tmp/public/**/*.html': require('../pipeline').cssFilesToInject,
        'views/**/*.html': require('../pipeline').cssFilesToInject,
        'views/**/*.sejs': require('../pipeline').cssFilesToInject
      }
    },

    devStylesBuild: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: linkFileRef,
        appRoot: '.tmp/public',
        relative: true
      },

      files: {
        '.tmp/public/**/*.html': require('../pipeline').cssFilesToInject,
      }
    },

    prodStyles: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: linkFileRef,
        appRoot: '.tmp/public'
      },
      files: {
        '.tmp/public/index.html': ['.tmp/public/min/production.min.css'],
        'views/**/*.html': ['.tmp/public/min/production.min.css'],
        'views/**/*.sejs': ['.tmp/public/min/production.min.css']
      }
    },

    prodStylesBuild: {
      options: {
        startTag: '<!--STYLES-->',
        endTag: '<!--STYLES END-->',
        fileRef: linkFileRef,
        appRoot: '.tmp/public',
        relative: true
      },
      files: {
        '.tmp/public/index.html': ['.tmp/public/min/production.min.css'],
      }
    },


    //  ╔═╗╦═╗╔═╗╔═╗╔═╗╔╦╗╔═╗╦╦  ╔═╗╔╦╗  ╦ ╦╔╦╗╔╦╗╦    ╔╦╗╔═╗╔╦╗╔═╗╦  ╔═╗╔╦╗╔═╗╔═╗
    //  ╠═╝╠╦╝║╣ ║  ║ ║║║║╠═╝║║  ║╣  ║║  ╠═╣ ║ ║║║║     ║ ║╣ ║║║╠═╝║  ╠═╣ ║ ║╣ ╚═╗
    //  ╩  ╩╚═╚═╝╚═╝╚═╝╩ ╩╩  ╩╩═╝╚═╝═╩╝  ╩ ╩ ╩ ╩ ╩╩═╝   ╩ ╚═╝╩ ╩╩  ╩═╝╩ ╩ ╩ ╚═╝╚═╝
    //  ┌─    ┌─┐┬  ┬┌─┐┌┐┌┌┬┐  ┌─┐┬┌┬┐┌─┐  ┬  ┌─┐┌┬┐┌─┐┌─┐┬ ┬  ┌┬┐┌─┐┌┬┐┌─┐┬  ┌─┐┌┬┐┌─┐┌─┐    ─┐
    //  │───  │  │  │├┤ │││ │───└─┐│ ││├┤   │  │ │ ││├─┤└─┐├─┤   │ ├┤ │││├─┘│  ├─┤ │ ├┤ └─┐  ───│
    //  └─    └─┘┴─┘┴└─┘┘└┘ ┴   └─┘┴─┴┘└─┘  ┴─┘└─┘─┴┘┴ ┴└─┘┴ ┴   ┴ └─┘┴ ┴┴  ┴─┘┴ ┴ ┴ └─┘└─┘    ─┘
    clientSideTemplates: {
      options: {
        startTag: '<!--TEMPLATES-->',
        endTag: '<!--TEMPLATES END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public'
      },
      files: {
        '.tmp/public/index.html': ['.tmp/public/jst.js'],
        'views/**/*.html': ['.tmp/public/jst.js'],
        'views/**/*.sejs': ['.tmp/public/jst.js']
      }
    },
    clientSideTemplatesBuild: {
      options: {
        startTag: '<!--TEMPLATES-->',
        endTag: '<!--TEMPLATES END-->',
        fileRef: scriptFileRef,
        appRoot: '.tmp/public',
        relative: true
      },
      files: {
        '.tmp/public/index.html': ['.tmp/public/jst.js'],
      }
    },

  });//</ grunt.config.set() >

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // This Grunt plugin is part of the default asset pipeline in Sails,
  // so it's already been automatically loaded for you at this point.
  //
  // Of course, you can always remove this Grunt plugin altogether by
  // deleting this file.  But check this out: you can also use your
  // _own_ custom version of this Grunt plugin.
  //
  // Here's how:
  //
  // 1. Install it as a local dependency of your Sails app:
  //    ```
  //    $ npm install grunt-sails-linker --save-dev --save-exact
  //    ```
  //
  //
  // 2. Then uncomment the following code:
  //
  // ```
  // // Load Grunt plugin from the node_modules/ folder.
  // grunt.loadNpmTasks('grunt-sails-linker');
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};
