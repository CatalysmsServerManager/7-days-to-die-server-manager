'use strict';

let I;

module.exports = {

    _init() {
        I = require('../steps_file.js')();
    },

    // insert your locators and methods here
    fields: {
        commandInput: '#input-command'
    },

    submitButton: '#input-command-button',

    executeCommand(command) {
        I.fillField(this.fields.commandInput, command);
        I.click(this.submitButton);
    }
}