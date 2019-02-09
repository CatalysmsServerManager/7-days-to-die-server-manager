[![codecov](https://codecov.io/gh/CatalysmsServerManager/7-days-to-die-server-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/CatalysmsServerManager/7-days-to-die-server-manager)
[![Build Status](https://travis-ci.org/CatalysmsServerManager/7-Days-to-Die-API-wrapper.svg?branch=master)](https://travis-ci.org/CatalysmsServerManager/7-Days-to-Die-API-wrapper)

# 7DTD Server manager 

## [Public instance of CSMM](https://csmm.catalysm.net/)

## Features


- Server automation - run any command in any time interval you want. Timed server messages, automatic world saving, ...
- Discord notifications - built-in for common use cases. Ability to detect specific strings for your custom purposes.
- High ping kicker - Kick players with constant bad connection.
- Country ban - automatically kick or ban players from certain countries from your server.
- Player tracking - Track location and inventory of online players and view them on a map of your server.
- Ingame commands - Playermade teleports, ingame support system, ... Custom commands to expose console commands to players in a controlled way
- Economy system - Let players earn money by playing, killing zombies, typing on your Discord server. They can spend their cash in your servers shop, teleports and more.
- Discord integration - Chat bridge (chat between Discord and the game), multiple commands to view player info or view server status.
- Support ticket system - Let players create support requests ingame. Admins can view and comment on these via the website to provide quick support for players.
- Server analytics - charts of # of online players, server FPS, RAM usage.


## Installation

Experience running Node.js apps is recommended. CSMM is tested on and developed for Linux. It will *probably* also work on Windows.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- Steam API key

    Go to the [Valve API key page](https://steamcommunity.com/dev/apikey) and register a key.

- Discord bot account

    Go to the [Discord developer page](https://discordapp.com/developers/applications) and create a new application. You must also make this application a bot account.

    Collect the following values from the page:
    * Client ID
    * Client secret
    * Bot token
  
- MySQL

    Set up a user and corresponding database.

### Installing and configuring the application

1. Clone this repo to your machine.
2. Run `npm install --only=prod` to install the dependencies
3. Copy the .env.example file to .env
   
    Fill in the info you've gathered so far. For the DBSTRING, a special syntax is used. You should replace anything in [] with your personal database values.

    ```
    DBSTRING=mysql2://[USER]:[PASSWORD]@localhost:3306/[DATABASE_NAME]
    ```

    CSMM_HOSTNAME is used to generate links, CORS and other things. You should set this to the ip/domain you will access CSMM from. For example `CSMM_HOSTNAME=http://localhost:1337` or `CSMM_HOSTNAME=https://csmm.yourserver.com` 

4. Add redis support

### Optional: Add redis support

5. Put the app in production mode. This is done by setting the env variable NODE_ENV=production


## Documentation

[Confluence](https://confluence.catalysm.net/display/CSM) contains our knowledgebase of (advanced) configuration topics.

## Support

We are happy to help you on our [Discord server](https://discordapp.com/invite/EwyDdNA).

## Donations

Donations are highly appreciated and help us enormously! You can make a monthly pledge on [Patreon](https://www.patreon.com/bePatron?c=1523282) or send a one-time payment via [Paypal](https://www.paypal.me/catalysmdev).