module.exports = {
  //   ╔═╗╔═╗╦  ╦╔╗╔╔╦╗┬─┐┌─┐
  //   ║╣ ╚═╗║  ║║║║ ║ ├┬┘│
  //  o╚═╝╚═╝╩═╝╩╝╚╝ ╩ ┴└─└─┘
  // A set of basic code conventions (similar to a .jshintrc file) designed to
  // and encourage quality and consistency across your Sails app's code base.
  // These rules are checked against automatically any time you run `npm test`.
  //
  // > An additional eslintrc override file is included in the `assets/` folder
  // > right out of the box.  This is specifically to allow for variations in acceptable
  // > global variables between front-end JavaScript code designed to run in the browser
  // > vs. backend code designed to run in a Node.js/Sails process.
  //
  // > Note: If you're using mocha, you'll want to add an extra override file to your
  // > `test/` folder so that eslint will tolerate mocha-specific globals like `before`
  // > and `describe`.
  //
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // For more information about any of the rules below, check out the relevant
  // reference page on eslint.org.  For example, to get details on "no-sequences",
  // you would visit `http://eslint.org/docs/rules/no-sequences`.
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  'env': {
    'es6': true,
    'node': true
  },

  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },

  'globals': {
    // If "no-undef" is enabled below and your app uses globals, be sure to list all
    // relevant globals below (including the globalIds of models, if relevant):
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // "sails": true,
    // "_": true,
    // "async": true,
    // ...and any other backend globals (e.g. `"User": true`)
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  },

  'rules': {
    'callback-return': [2, ['callback', 'cb', 'next', 'done', 'proceed']],
    'camelcase': [1, { 'properties': 'always' }],
    'comma-style': [2, 'last'],
    'curly': [2],
    'eqeqeq': [2, 'always'],
    'eol-last': [1],
    'handle-callback-err': [2],
    'indent': [1, 2, { 'SwitchCase': 1 }],
    'no-dupe-keys': [2],
    'no-duplicate-case': [2],
    'no-mixed-spaces-and-tabs': [2, 'smart-tabs'],
    'no-return-assign': [2, 'always'],
    'no-sequences': [2],
    'no-trailing-spaces': [1],
    'no-undef': [0],
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // ^^Note: If this "no-undef" rule is enabled (set to `[2]`), then model globals
    // (e.g. `"User": true`) should also be included above under "globals".
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    'no-unexpected-multiline': [1],
    'no-unused-vars': [1],
    'one-var': [2, 'never'],
    'quotes': [1, 'single', { 'avoidEscape': false, 'allowTemplateLiterals': true }],
    'semi': [2, 'always']
  }

};
