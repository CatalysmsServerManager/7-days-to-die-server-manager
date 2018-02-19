Feature('Basic server actions');

Before((I) => { // or Background
    I.loginSteam();
    I.addTestServer();
  });

After((I) => {
    I.deleteTestServer();
})

let chatMessages = new DataTable(['message'])

chatMessages.add(['Testing dashboard chat']);

Data(chatMessages).Scenario('Chat', (I, current, dashboardPage) => {
    dashboardPage.sendChatMessage(current.message);
    I.waitForElement('.chat-message', 10);
    I.see(current.message, ".chat-window")
})


let consoleCommands = new DataTable(['command', 'expected']);

consoleCommands.add(['gg', "GamePref.ZombiesRun"]);
consoleCommands.add(['lpi', "Total of"])
consoleCommands.add(['admin list', "Defined Permissions:"])

Data(consoleCommands).Scenario('Console', (I, current, dashboardPage) => {
    dashboardPage.sendConsoleCommand(current.command);
    I.waitForElement('.log-line', 10);
    I.see(current.expected, ".console-window")
});

Scenario('Console "say" command should show up in chat', (I, dashboardPage) => {
    dashboardPage.sendConsoleCommand('say "testing if console command shows up in chat"');
    I.waitForElement('.chat-message', 10);
    I.see("testing if console command shows up in chat", ".chat-window")
})