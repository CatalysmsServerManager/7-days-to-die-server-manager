/**
 * `tasks/register/prod.js`
 *
 * ---------------------------------------------------------------
 *
 * This Grunt tasklist will be executed instead of `default` when
 * your Sails app is lifted in a production environment (e.g. using
 * `NODE_ENV=production node app`).
 *
 * For more information see:
 *   https://sailsjs.com/anatomy/tasks/register/prod.js
 *
 */
module.exports = function(grunt) {
  // grunt.registerTask('prod', [
  //   'polyfill:prod', //« Remove this to skip transpilation in production (not recommended)
  //   'compileAssets',
  //   'babel',         //« Remove this to skip transpilation in production (not recommended)
  //   'concat',
  //   'uglify',
  //   'cssmin',
  //   'sails-linker:prodJs',
  //   'sails-linker:prodStyles',
  //   'sails-linker:clientSideTemplates',
  // ]);

 // Something is original prod task breaks the build. So using dev task as prod for now ¯\_(ツ)_/¯

  grunt.registerTask('prod', [
    //'polyfill:dev', //« uncomment to ALSO transpile during development (for broader browser compat.)
    'compileAssets',
    // 'babel',        //« uncomment to ALSO transpile during development (for broader browser compat.)
    'linkAssets',
  //  'watch'
  ]);
};

