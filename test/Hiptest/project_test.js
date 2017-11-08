describe('Bill 2.0', function () {
  beforeEach(function () {
    this.actionwords = Object.create(require('./actionwords.js').Actionwords);
  });

  it('PlayerDiesRevive', function () {
    // Given a player dies
    this.actionwords.aPlayerDies();
    // Then he gets to option to $revive for x BillBucks
    this.actionwords.heGetsToOptionToReviveForXBillBucks();
  });

  it('PlayerRevives', function () {
    // Given a player died and used $revive
    this.actionwords.aPlayerDiedAndUsedRevive();
    // Then a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // And the player will be teleported to where he died
    this.actionwords.thePlayerWillBeTeleportedToWhereHeDied();
    // And he will get his inventory back
    this.actionwords.heWillGetHisInventoryBack();
    // And the dropped backpack has to be deleted/disabled
    this.actionwords.theDroppedBackpackHasToBeDeleteddisabled();
  });

  it('PlayerSetTeleportLocation (billgate)', function () {
    // When a player sets a location
    this.actionwords.aPlayerSetsALocation();
    // Given they have x amount of billbucks
    this.actionwords.theyHaveXAmountOfBillbucks();
    // Then a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // And message shows up in chat teleport location set
    this.actionwords.messageShowsUpInChatTeleportLocationSet();
  });

  it('PlayerDeletingTeleportLocation (billgate)', function () {
    // When player Deletes set location
    this.actionwords.playerDeletesSetLocation();
    // Then message shows up in chat teleport location deleted
    this.actionwords.messageShowsUpInChatTeleportLocationDeleted();
  });

  it('PlayerUsingTelportLocation (billgate)', function () {
    // Given player uses a set location eg $billgate base
    this.actionwords.playerUsesASetLocationEgBillgateBase();
    // When they have x amount of billbucks
    this.actionwords.theyHaveXAmountOfBillbucks();
    // Then a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // Then player will be teletported to set location
    this.actionwords.playerWillBeTeletportedToSetLocation();
  });

  it('PlayerJoinsCheckCountryCode', function () {
    // Given a player connects to the server
    this.actionwords.aPlayerConnectsToTheServer();
    // Then check Country code to make sure country is not on blacklist configurable by server owner
    this.actionwords.checkCountryCodeToMakeSureCountryIsNotOnBlacklistConfigurableByServerOwner();
    // When country is on blacklist
    this.actionwords.countryIsOnBlacklist();
    // Then player gets kicked with reason "Your country is on the blocked countries list"
    this.actionwords.playerGetsKickedWithReasonTooMuchPing("Your country is on the blocked countries list", "");
    // And a message is shown that the country is banned
    this.actionwords.aMessageIsShownThatTheCountryIsBanned();
  });

  it('PlayerCheckBalance', function () {
    // Tags: Feature:BillBucks
    // Given a player runs command $balance
    this.actionwords.aPlayerRunsCommandBalance();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And pm the player in chat the amount of billbucks in there account
    this.actionwords.pmThePlayerInChatTheAmountOfBillbucksInThereAccount();
  });

  it('PlayerToPlayerTransfer', function () {
    // Tags: Feature:BillBucks
    // When player 1 runs $send to player 2 command
    this.actionwords.player1RunsSendToPlayer2Command();
    // Given they have x amount
    this.actionwords.theyHaveXAmount();
    // Then the x amount of BillBucks has to be subtracted from the player 1 balance
    this.actionwords.theXAmountOfBillBucksHasToBeSubtractedFromThePlayer1Balance();
    // And x amount of BillBucks has to be added to player 2 balance
    this.actionwords.xAmountOfBillBucksHasToBeAddedToPlayer2Balance();
    // Then pm player1 in chat transfer successful
    this.actionwords.pmPlayer1InChatTransferSuccessful();
    // And pm player2 in chat transfer successful
    this.actionwords.pmPlayer2InChatTransferSuccessful();
  });

  it('BillShopLinkCommand', function () {
    // Tags: Feature:BillShop
    // Given player runs command $shop
    this.actionwords.playerRunsCommandShop();
    // And check $shop is enabled
    this.actionwords.checkShopIsEnabled();
    // Then send link inchat to servers shop
    this.actionwords.sendLinkInchatToServersShop();
  });

  it('BillShopBuying', function () {
    // Q: is there a way to give players an item without dropping it at their feet?
    // Tags: Feature:BillShop
    // Given a player runs command $buy (eg $buy 3003)
    this.actionwords.aPlayerRunsCommandBuyEgBuy3003();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // And pm player "bought items at your feet"
    this.actionwords.pmPlayerBoughtItemsAtYourFeet("bought items at your feet");
    // Then drop item at players feet
    this.actionwords.dropItemAtPlayersFeet();
  });

  it('PlayerCheckBalance(discord)', function () {
    // Tags: Feature:BillBucks
    // Given a player runs command $balance
    this.actionwords.aPlayerRunsCommandBalance();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And pm the player in discord the amount of billbucks in there account
    this.actionwords.pmThePlayerInDiscordTheAmountOfBillbucksInThereAccount();
  });

  it('PlayerToPlayerTransfer(discord)', function () {
    // Tags: Feature:BillBucks
    // When player 1 runs $send to player 2 command
    this.actionwords.player1RunsSendToPlayer2Command();
    // Given they have x amount of billbucks
    this.actionwords.theyHaveXAmountOfBillbucks();
    // Then the x amount of BillBucks has to be subtracted from the player 1 balance
    this.actionwords.theXAmountOfBillBucksHasToBeSubtractedFromThePlayer1Balance();
    // And x amount of BillBucks has to be added to player 2 balance
    this.actionwords.xAmountOfBillBucksHasToBeAddedToPlayer2Balance();
    // Then pm player 1 in discord transfer successful
    this.actionwords.pmPlayer1InDiscordTransferSuccessful();
    // And pm player2 in chat transfer successful
    this.actionwords.pmPlayer2InChatTransferSuccessful();
  });

  it('BillShopLinkCommandDiscord', function () {
    // Tags: Feature:BillShop
    // Given player runs command $shop
    this.actionwords.playerRunsCommandShop();
    // And check $shop is enabled
    this.actionwords.checkShopIsEnabled();
    // Then pm link in discord to shop
    this.actionwords.pmLinkInDiscordToShop();
  });

  it('BillShopBuying(discord)PlayerOnline', function () {
    // Tags: Feature:BillShop
    // Given a player runs command $buy (eg $buy 3003)
    this.actionwords.aPlayerRunsCommandBuyEgBuy3003();
    // And the player is ingame
    this.actionwords.thePlayerIsIngame();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // And pm player "bought items at your feet"
    this.actionwords.pmPlayerBoughtItemsAtYourFeet("bought items at your feet");
  });

  it('BillShopCodeList(discord)', function () {
    // Tags: Feature:BillShop
    // Given player runs $shop list in discord
    this.actionwords.playerRunsShopListInDiscord();
    // Then check $shop is enabled
    this.actionwords.checkShopIsEnabled();
    // And pm list of buy codes to player in discord
    this.actionwords.pmListOfBuyCodesToPlayerInDiscord();
  });

  it('BillShop(Website)PlayerOnline', function () {
    // Tags: Feature:BillShop
    // Given a player logs into billshop link
    this.actionwords.aPlayerLogsIntoBillshopLink();
    // And buys a item from the shop
    this.actionwords.buysAItemFromTheShop();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // Then check if player is online
    this.actionwords.checkIfPlayerIsOnline();
    // Then drop item at players feet
    this.actionwords.dropItemAtPlayersFeet();
  });

  it('BillShopBuying(discord)PlayerOffline', function () {
    // Tags: Feature:BillShop
    // Given a player runs command $buy (eg $buy 3003)
    this.actionwords.aPlayerRunsCommandBuyEgBuy3003();
    // And The player is not ingame
    this.actionwords.thePlayerIsNotIngame();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // Then when a player gets online
    this.actionwords.whenAPlayerGetsOnline();
    // And pm player "bought items at your feet"
    this.actionwords.pmPlayerBoughtItemsAtYourFeet("bought items at your feet");
  });

  it('BillShop(Website)PlayerOffline', function () {
    // Tags: Feature:BillShop
    // Given a player logs into billshop link
    this.actionwords.aPlayerLogsIntoBillshopLink();
    // And The player is not ingame
    this.actionwords.thePlayerIsNotIngame();
    // And buys a item from the shop
    this.actionwords.buysAItemFromTheShop();
    // Then check players billbucks account
    this.actionwords.checkPlayersBillbucksAccount();
    // And a certain amount of BillBucks has to be subtracted from the players balance
    this.actionwords.aCertainAmountOfBillBucksHasToBeSubtractedFromThePlayersBalance();
    // Then when a player gets online
    this.actionwords.whenAPlayerGetsOnline();
    // And pm player "bought items at your feet"
    this.actionwords.pmPlayerBoughtItemsAtYourFeet("bought items at your feet");
  });

  it('DiscordCommandRestartSuccess', function () {
    // Tags: Feature:Game Administration
    // Given a discord user executes the "restart" command
    this.actionwords.aDiscordUserExecutesTheP1Command("restart");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // Then perform ingame countdown before restarting server
    this.actionwords.performIngameCountdownBeforeRestartingServer();
    // And Restart server
    this.actionwords.restartServer();
  });

  it('AdminRestartCommand(website)', function () {
    // Tags: Feature:Game Administration
    // Given a player runs $restart
    this.actionwords.aPlayerRunsRestart();
    // Then check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // Then Countdown ingame
    this.actionwords.countdownIngame();
    // Then Restart server
    this.actionwords.restartServer();
  });

  it('AdminRestartCommand(mobileapp)', function () {
    // Tags: Feature:Game Administration
    // Given a player runs $restart
    this.actionwords.aPlayerRunsRestart();
    // Then check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // Then Countdown ingame
    this.actionwords.countdownIngame();
    // Then Restart server
    this.actionwords.restartServer();
  });

  it('DiscordExecuteConsoleSuccess', function () {
    // Tags: Feature:Game Administration
    // Given A Discord user executed the command "executeConsole" with parameters "ingameCommand args"
    this.actionwords.aDiscordUserExecutedTheCommandExecuteConsoleWithParametersArgumentX14("executeConsole", "ingameCommand args");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // Then the ingame command "ingameCommand args" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("ingameCommand args");
  });

  it('AdminCommands(website)', function () {
    // Tags: Feature:Game Administration
    // Given a player types in console command window
    this.actionwords.aPlayerTypesInConsoleCommandWindow();
    // And check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // Then execute the specified command
    this.actionwords.executeTheSpecifiedCommand();
    // And show output to players
    this.actionwords.showOutputToPlayers();
  });

  it('AdminCommands(MobileApp)', function () {
    // Tags: Feature:Game Administration
    // Given a player types in console command window
    this.actionwords.aPlayerTypesInConsoleCommandWindow();
    // And check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // Then execute the specified command
    this.actionwords.executeTheSpecifiedCommand();
    // And show output to players
    this.actionwords.showOutputToPlayers();
  });

  it('InitDiscordChatBridgeSuccess', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord user executes the "chatbridge init" command
    this.actionwords.aDiscordUserExecutesTheP1Command("chatbridge init");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // Then a new discord chatbridge is initialized
    this.actionwords.aNewDiscordChatbridgeIsInitialized();
  });

  it('DiscordMessageToGame', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord chatbridge is initialized in a text channel
    this.actionwords.aDiscordChatbridgeIsInitializedInATextChannel();
    // And a discord user typed a message in the channel
    this.actionwords.aDiscordUserTypedAMessageInTheChannel();
    // Then the ingame command "say {message}" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("say {message}");
  });

  it('DiscordCommandInChatBridge', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord chatbridge is initialized in a text channel
    this.actionwords.aDiscordChatbridgeIsInitializedInATextChannel();
    // And a user typed a command in the channel
    this.actionwords.aUserTypedACommandInTheChannel();
    // Then the message should be ignored
    this.actionwords.theMessageShouldBeIgnored();
  });

  it('InitDiscordChatBridgeFailureUserPermissions', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord user executes the "chatbridge init" command
    this.actionwords.aDiscordUserExecutesTheP1Command("chatbridge init");
    // And the discord user does not have permssion
    this.actionwords.theDiscordUserDoesNotHavePermssion();
    // Then a error message "Unauthorized" is shown
    this.actionwords.aErrorMessageP1IsShown("Unauthorized");
  });

  it('InitDiscordChatBridgeFailureBotPermissions', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord user executes the "chatbridge init" command
    this.actionwords.aDiscordUserExecutesTheP1Command("chatbridge init");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // And the bot does not have the "send messages" permission
    this.actionwords.theBotDoesNotHaveTheP1Permission("send messages");
    // Then the discord user is DMed with a error message "Please give the bot send messages permission"
    this.actionwords.theDiscordUserIsDMedWithAErrorMessageP1("Please give the bot send messages permission");
  });

  it('DiscordConsoleBridgeNewLogLine', function () {
    // Tags: Feature:Discord Console Bridge
    // Given a discord console bridge is initialized in a text channel
    this.actionwords.aDiscordConsoleBridgeIsInitializedInATextChannel();
    // And there is a new log line from the game
    this.actionwords.thereIsANewLogLineFromTheGame();
    // Then a message has to be sent to the discord channel "{Date/time} {log line}"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("{Date/time} {log line}");
  });

  it('GameMessageToDiscordChatBridge', function () {
    // Tags: Feature:Discord Chat Bridge
    // Given a discord chatbridge is initialized in a text channel
    this.actionwords.aDiscordChatbridgeIsInitializedInATextChannel();
    // And there is a new chat message from the game
    this.actionwords.thereIsANewChatMessageFromTheGame();
    // And the configuration for the type of chat message is set to true
    this.actionwords.theConfigurationForTheTypeOfChatMessageIsSetToTrue();
    // Then a message has to be sent to the discord channel "{playerName} - {message}"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("{playerName} - {message}");
  });

  it('DiscordExecuteConsoleFailureUserPermissions', function () {
    // Tags: Feature:Game Administration
    // Given A Discord user executed the command "executeConsole" with parameters "any"
    this.actionwords.aDiscordUserExecutedTheCommandExecuteConsoleWithParametersArgumentX14("executeConsole", "any");
    // And the discord user does not have permssion
    this.actionwords.theDiscordUserDoesNotHavePermssion();
    // Then a message has to be sent to the discord channel "Error: you have to have admin permissions to use execute console!"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("Error: you have to have admin permissions to use execute console!");
  });

  it('DiscordCommandFailureBotPermissions', function () {
    // Given a discord user executes the "any" command
    this.actionwords.aDiscordUserExecutesTheP1Command("any");
    // And the bot does not have the "send_messages" permission
    this.actionwords.theBotDoesNotHaveTheP1Permission("send_messages");
    // Then set error flag "Discord bot does not have send_messages permission in a channel where he can read messages"
    this.actionwords.setErrorFlagP1("Discord bot does not have send_messages permission in a channel where he can read messages");
  });

  it('DiscordExecuteConsoleFailureResponse403', function () {
    // Tags: Feature:Game Administration
    // Given A Discord user executed the command "executeConsole" with parameters "any"
    this.actionwords.aDiscordUserExecutedTheCommandExecuteConsoleWithParametersArgumentX14("executeConsole", "any");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // And the server responds with a "403" error
    this.actionwords.theServerRespondsWithAP1Error("403");
    // Then a message has to be sent to the discord channel "Error: not authorized (Are permissions set up correctly?)"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("Error: not authorized (Are permissions set up correctly?)");
  });

  it('DiscordExecuteConsoleFailureResponse501', function () {
    // Tags: Feature:Game Administration
    // Given A Discord user executed the command "executeConsole" with parameters "any"
    this.actionwords.aDiscordUserExecutedTheCommandExecuteConsoleWithParametersArgumentX14("executeConsole", "any");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // And the server responds with a "501" error
    this.actionwords.theServerRespondsWithAP1Error("501");
    // Then a message has to be sent to the discord channel "Error: you entered an invalid command syntax"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("Error: you entered an invalid command syntax");
  });

  it('DiscordCommandDay7success', function () {
    // Given a discord user executes the "Day7" command
    this.actionwords.aDiscordUserExecutesTheP1Command("Day7");
    // And the discord user has permission
    this.actionwords.theDiscordUserHasPermission();
    // Then day7 data is loaded
    this.actionwords.day7DataIsLoaded();
    // And a message has to be sent to the discord channel "with day7 data"
    this.actionwords.aMessageHasToBeSentToTheDiscordChannelP1("with day7 data");
  });

  it('DiscordCommandRestartFailureUserPermissions', function () {
    // Tags: Feature:Game Administration
    // Given a discord user executes the "restart" command
    this.actionwords.aDiscordUserExecutesTheP1Command("restart");
    // And the discord user does not have permssion
    this.actionwords.theDiscordUserDoesNotHavePermssion();
    // Then a error message "Unauthorized: You do not have permissions to use this command. Contact the server owner if you think this is a mistake." is shown
    this.actionwords.aErrorMessageP1IsShown("Unauthorized: You do not have permissions to use this command. Contact the server owner if you think this is a mistake.");
  });

  it('IngameCommandCallAdminSuccess', function () {
    // Given a player executes the "callAdmin" command
    this.actionwords.aPlayerExecutesTheP1Command("callAdmin");
    // And the "callAdmin" command is enabled
    this.actionwords.theP1CommandIsEnabled("callAdmin");
    // Then a IngameSupport ticket is made
    this.actionwords.aIngameSupportTicketIsMade();
    // And a PM is sent to the player with message: "{link}"
    this.actionwords.aPMIsSentToThePlayerWithMessageP1("{link}");
  });

  it('CreateIngameSupportTicket', function () {
    // Given a player creates a new Ingame Support Ticket
    this.actionwords.aPlayerCreatesANewIngameSupportTicket();
    // Then get location of player
    this.actionwords.getLocationOfPlayer();
    // And save ticket to database with metadata
    this.actionwords.saveTicketToDatabaseWithMetadata();
  });

  it('PlayerJoins', function () {
    // Given a player connects to the server
    this.actionwords.aPlayerConnectsToTheServer();
    // Then extract data from log line "Player name, ip, ..."
    this.actionwords.extractDataFromLogLineP1("Player name, ip, ...");
    // And emit event "playerConnected"
    this.actionwords.emitEventPlayerConnected("playerConnected");
  });

  it('PlayerLeaves', function () {
    // Given a player disconnects from server
    this.actionwords.aPlayerDisconnectsFromServer();
    // Then extract data from log line "playername, ip, steamid, ..."
    this.actionwords.extractDataFromLogLineP1("playername, ip, steamid, ...");
    // And emit event "playerDisconnected"
    this.actionwords.emitEventPlayerConnected("playerDisconnected");
  });

  it('PlayerKicked', function () {
    // Given a player is kicked from the server
    this.actionwords.aPlayerIsKickedFromTheServer();
    // Then extract data from log line "playername, steamid, reason"
    this.actionwords.extractDataFromLogLineP1("playername, steamid, reason");
    // And emit event "playerKicked"
    this.actionwords.emitEventPlayerConnected("playerKicked");
  });

  it('PlayerBanned', function () {
    // Given a player is banned from the server
    this.actionwords.aPlayerIsBannedFromTheServer();
    // Then extract data from log line "playername, reason "
    this.actionwords.extractDataFromLogLineP1("playername, reason ");
    // And emit event "playerBanned"
    this.actionwords.emitEventPlayerConnected("playerBanned");
  });

  it('ChatMessage', function () {
    // Given player typed a message ingame
    this.actionwords.playerTypedAMessageIngame();
    // Then extract data from log line "playerName, message"
    this.actionwords.extractDataFromLogLineP1("playerName, message");
    // And emit event "chatMessage"
    this.actionwords.emitEventPlayerConnected("chatMessage");
  });

  it('PlayerKickedForTooMuchPing', function () {
    // Given an online player has more than the max configured ping
    this.actionwords.anOnlinePlayerHasMoreThanTheMaxConfiguredPing();
    // Then player gets kicked with reason "Too much ping"
    this.actionwords.playerGetsKickedWithReasonTooMuchPing("Too much ping", "");
  });

  it('UserLogsInWithDiscord', function () {
    // Given a user logs in with discord
    this.actionwords.aUserLogsInWithDiscord();
    // And Extract data from discord "Guilds"
    this.actionwords.extractDataFromDiscordP1("Guilds");
    // Then save "guilds that have Bill in it" to user profile
    this.actionwords.saveP1ToUserProfile("guilds that have Bill in it");
  });

  it('PlayerLogsInWithSteam', function () {
    // Given a user logs in with steam
    this.actionwords.aUserLogsInWithSteam();
    // Then extract data from steam "steamID"
    this.actionwords.extractDataFromSteamP1("steamID");
    // And save "steamID" to user profile
    this.actionwords.saveP1ToUserProfile("steamID");
  });

  it('GBLBasicSuccess', function () {
    // Given a player is banned from the server
    this.actionwords.aPlayerIsBannedFromTheServer();
    // Then a new ban entry is made with data "name, date/time, reason, servername, adminname, serverID"
    this.actionwords.aNewBanEntryIsMadeWithDataP1("name, date/time, reason, servername, adminname, serverID");
  });

  it('Detect command prefix', function () {
    // Given player typed a message ingame
    this.actionwords.playerTypedAMessageIngame();
    // And the message starts with the configured prefix
    this.actionwords.theMessageStartsWithTheConfiguredPrefix();
    // Then emit event "command"
    this.actionwords.emitEventPlayerConnected("command");
  });

  it('RunCommand', function () {
    // Given a "command" event is detected
    this.actionwords.aP1EventIsDetected("command");
    // And the "" command is enabled
    this.actionwords.theP1CommandIsEnabled("");
    // Then the ingame command "{command}" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("{command}");
  });

  it('IngameCommandCallAdminFailureNoReason', function () {
    // Given a player executes the "callAdmin" command
    this.actionwords.aPlayerExecutesTheP1Command("callAdmin");
    // And the command is ran without arguments
    this.actionwords.theCommandIsRanWithoutArguments();
    // Then a PM is sent to the player with message: "Please provide a reason to call an admin."
    this.actionwords.aPMIsSentToThePlayerWithMessageP1("Please provide a reason to call an admin.");
  });

  it('ConnectionLost', function () {
    // Given system loses connection to 7 days to die server
    this.actionwords.systemLosesConnectionTo7DaysToDieServer();
    // Then set error flag "NOCONNECTION"
    this.actionwords.setErrorFlagP1("NOCONNECTION");
    // And emit event "connectionLost"
    this.actionwords.emitEventPlayerConnected("connectionLost");
  });

  it('ConnectionRegained', function () {
    // Given system regains connection to the 7 days to die server
    this.actionwords.systemRegainsConnectionToThe7DaysToDieServer();
    // Then remove error flag "NOCONNECTION"
    this.actionwords.removeErrorFlagP1("NOCONNECTION");
    // And emit event "connectionRegained"
    this.actionwords.emitEventPlayerConnected("connectionRegained");
  });

  it('RunCommand Failure Invalid arguments', function () {
    // Given the ingame command "{command}" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("{command}");
    // And the command arguments are invalid
    this.actionwords.theCommandArgumentsAreInvalid();
    // Then a PM is sent to the player with message: "Please provide valid value for argument"
    this.actionwords.aPMIsSentToThePlayerWithMessageP1("Please provide valid value for argument");
  });

  it('RunCommand Failure Invalid Permissions', function () {
    // Given the ingame command "{command}" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("{command}");
    // And the player does not have permission
    this.actionwords.thePlayerDoesNotHavePermission();
    // Then a PM is sent to the player with message: "You do not have permission to use this command."
    this.actionwords.aPMIsSentToThePlayerWithMessageP1("You do not have permission to use this command.");
  });

  it('RunCommand Failure command not enabled', function () {
    // Given the ingame command "{command}" has to be executed
    this.actionwords.theIngameCommandP1HasToBeExecuted("{command}");
    // And the command is not enabled
    this.actionwords.theCommandIsNotEnabled();
    // Then the message should be ignored
    this.actionwords.theMessageShouldBeIgnored();
  });

  it('ScheduleAutoRestart', function () {
    // Given a player sets Schedule for server restart
    this.actionwords.aPlayerSetsScheduleForServerRestart();
    // And check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // Then perform ingame countdown before restarting server
    this.actionwords.performIngameCountdownBeforeRestartingServer();
    // And Restart server
    this.actionwords.restartServer();
  });

  it('ScheduleAutoRestartOfflineServer', function () {
    // Given a player sets Schedule for server restart
    this.actionwords.aPlayerSetsScheduleForServerRestart();
    // And check if player has permission to execute command
    this.actionwords.checkIfPlayerHasPermissionToExecuteCommand();
    // And error flag "NOCONNECTION" is set
    this.actionwords.errorFlagP1IsSet("NOCONNECTION");
    // Then do nothing
    this.actionwords.doNothing();
  });

  it('MotdOnConnect', function () {
    // Given a player connects to the server
    this.actionwords.aPlayerConnectsToTheServer();
    // And motd is enabled
    this.actionwords.motdIsEnabled();
    // Then show motd message in chat
    this.actionwords.showMotdMessageInChat();
  });

  it('VoteLink', function () {
    // Given a player runs command $vote
    this.actionwords.aPlayerRunsCommandVote();
    // Then send link in chat to voting system
    this.actionwords.sendLinkInChatToVotingSystem();
  });

  it('VoteReward', function () {
    // Given a player runs command $reward
    this.actionwords.aPlayerRunsCommandReward();
    // And they have voted
    this.actionwords.theyHaveVoted();
    // Then drop item at players feet
    this.actionwords.dropItemAtPlayersFeet();
    // And pm player reward at your feet
    this.actionwords.pmPlayerRewardAtYourFeet();
  });

  it('VoteReward (not voted)', function () {
    // Given a player runs command $reward
    this.actionwords.aPlayerRunsCommandReward();
    // And they have not voted
    this.actionwords.theyHaveNotVoted();
    // Then pm player you have not voted!
    this.actionwords.pmPlayerYouHaveNotVoted();
  });

  it('UserLogsIn', function () {
    // Given a user in on the login page
    this.actionwords.aUserInOnTheLoginPage();
    // And fills in "Cata" and "something"
    this.actionwords.fillsInP1AndP2("Cata", "something");
    // Then user is logged in
    this.actionwords.userIsLoggedIn();
  });
});
