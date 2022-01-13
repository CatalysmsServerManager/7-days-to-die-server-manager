const AddCurrency = require('../../../worker/util/customFunctions/addCurrency');
const SendDiscord = require('../../../worker/util/customFunctions/sendDiscord');
const SetRole = require('../../../worker/util/customFunctions/setRole');
const Wait = require('../../../worker/util/customFunctions/wait');
const Handlebars = require('../Handlebars');

const supportedFunctions = [
  new Wait(),
  new AddCurrency(),
  new SetRole(),
  new SendDiscord()
];

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;


// :)
// https://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically
function getParamNames(func) {
  const fnStr = func.toString().replace(STRIP_COMMENTS, '');
  let result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)  {
    result = [];
  }
  return result;
}

module.exports = class CSMMCommand {

  constructor(server, template, data) {
    this.server = server;
    this.template = template;
    this.data = data || {};
    this.results = [];
    this.errors = [];
  }

  async loadData() {
    this.data.server = this.server;
    this.data.server.config = await SdtdConfig.findOne({server: this.server.id});
    this.data.server.onlinePlayers = await sails.helpers.sdtd.loadPlayerData(this.server.id, undefined, true);
    this.data.server.stats = await sails.helpers.sdtdApi.getStats(SdtdServer.getAPIConfig(this.server));
    return this.data;
  }

  _renderHandlebars() {
    const compiledTemplate = Handlebars.compile(this.template);
    return compiledTemplate(this.data);
  }

  static getHelpers() {
    const helperBlacklist = [
      'each',
      'if',
      'helperMissing',
      'blockHelperMissing',
      'log',
    ];
    const response = [];
    for (const helper in Handlebars.helpers) {
      if (helperBlacklist.indexOf(helper) !== -1) {
        continue;
      }

      const element = Handlebars.helpers[helper];
      const parameters = getParamNames(element);
      response.push({name: helper, parameters});
    }
    return response;
  }

  async render() {
    try {
      this.template = await this._renderHandlebars();
    } catch (error) {
      this.errors.push(error.message);
    }


    try {
      if (this.template) {
        this.template = await sails.helpers.sdtd.parseCommandsString(
          this.template,
          this.data
        );
      }
    } catch (error) {
      this.errors.push(error.message);
    }
    await this._saveResult('templateRender');
    return {template: this.template, errors: this.errors};
  }


  async execute() {
    for (const command of this.template) {
      // Check if the command matches any custom functions
      const customFunction = checkForCustomFunction(command);
      if (customFunction) {
        // If we find a custom function, execute it
        const [result, customFunctionArgs] = await this._executeCustomFunction(customFunction, command, this.server);
        this.results.push({
          command: customFunction.name,
          parameters: command,
          result,
          customFunctionArgs
        });
      } else {
        // If the command is not a custom function, execute it as a game command
        let commandResult = await this._executeGameCommand(this.server, command);
        this.results.push(commandResult);
      }
    }
    await this._saveResult('execute');
    return this.results;
  }

  async _saveResult(reason) {
    if (reason !== 'templateRender' && reason !== 'execute') {
      throw new Error('Invalid reason for saving result');
    }

    await sails.helpers.redis.lpush(`sdtdserver:${this.server.id}:CSMMCommand:lastResults`, JSON.stringify({
      timestamp: Date.now(),
      results: this.results,
      errors: this.errors,
      template: this.template,
      data: this.data,
      reason
    }));

    await sails.helpers.redis.ltrim(`sdtdserver:${this.server.id}:CSMMCommand:lastResults`, 0, 19);
  }

  static async getLastResults(server) {
    const results = await sails.helpers.redis.lrange(`sdtdserver:${server.id}:CSMMCommand:lastResults`, 0, -1);
    return results.map(JSON.parse);
  }

  async _executeGameCommand(server, command) {
    try {
      let result = await sails.helpers.sdtdApi.executeConsoleCommand(
        SdtdServer.getAPIConfig(server),
        _.trim(command)
      );
      return result;
    } catch (error) {
      sails.log.error(error, {server});
      return {
        command,
        result: 'An error occurred executing the API request to the 7D2D server'
      };
    }
  }

  async _executeCustomFunction(fnc, command, server) {
    const args = getArgs(fnc, command);
    try {
      const res = await fnc.run(server, args);
      return [res, args];
    } catch (error) {
      return [error.message, args];
    }
  }

};


function getArgs(fnc, command) {
  const regex = new RegExp(`${fnc.name}\((.*)\)`, 'i');
  const res = command.match(regex);
  return res[1].slice(1, res[1].length - 1);
}

function checkForCustomFunction(command) {
  for (const fnc of supportedFunctions) {
    if (command.toLowerCase().includes(fnc.name.toLowerCase() + '(')) {
      return fnc;
    }
  }
  return false;
}

