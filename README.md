<div align="center">

# CSMM

[![Test Coverage](https://codecov.io/gh/CatalysmsServerManager/7-days-to-die-server-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/CatalysmsServerManager/7-days-to-die-server-manager)
[![Build Status](https://travis-ci.org/CatalysmsServerManager/7-days-to-die-server-manager.svg?branch=master)](https://travis-ci.org/CatalysmsServerManager/7-days-to-die-server-manager)
[![Discord](https://img.shields.io/discord/336821518250147850?label=Discord&logo=Discord)](http://catalysm.net/discord)

</div>

<div align="center">

CSMM is a web-based server manager for 7 Days to Die. It allows you to manage your server from anywhere, and provides a lot of useful features to make your life easier.
# Features

</div>

<div align="justify">



**Server automation** - Run any command in any time interval you want. Timed server messages, automatic world saving, ...

**Discord notifications** - Built-in for common use cases. Ability to detect specific strings for your custom purposes.

**High ping kicker** - Kick players with constant bad connection.

**Country ban** - Automatically kick or ban players from certain countries from your server.

**Player tracking** - Track location and inventory of online players and view them on a map of your server.

**Ingame commands** - Playermade teleports, ingame support system, ... Custom commands to expose console commands to players in a controlled way.
**Economy system** - Let players earn money by playing, killing zombies, typing on your Discord server. They can spend their cash in your servers shop, teleports and more.

**Discord integration** - Chat bridge(chat between Discord and the game), multiple commands to view player info or view server status.

**Support ticket system** - Let players create support requests in-game. Admins can view and comment on these via the website to provide quick support for players.

**Server analytics** - Charts of # of online players, server FPS, RAM usage.

</div>
<div align="center">

## [Installation](https://docs.csmm.app/en/CSMM/self-host/installation.html)

## [Documentation](https://docs.csmm.app)

## Community

Come chat on our [Discord server](http://catalysm.net/discord). 👋

## Development setup
<div align="justify">

There is an opinionated way of running a development environment for CSMM. This is not required, but it is the easiest way to get started. If you want more detailed instructions on the different components, check out the [host install method](https://docs.csmm.app/en/CSMM/self-host/installation.html).

This setup should work on most unix based systems, if you are on Windows, WSL is a good option.

### Requirements

 - [Docker](https://docs.docker.com/install/)
 - [Docker Compose](https://docs.docker.com/compose/install/)
 - [Node.js](https://nodejs.org/en/download/)
 - 7 Days to die server

### Setup

Clone the repo to your local machine

```sh
cp .env.example.host .env

# Take a look at the .env file and change any values you want. See the docs for more info on the different options

npm ci # Install dependencies
docker-compose -f docker-compose-dev.yml up -d # Start databases
npm run db:migrate # Setup the database tables
npm run dev # Start the server
```

</div>

## Sponsors

[![Sentry](assets/images/meta/sentry.png)](https://sentry.io)

</div>
