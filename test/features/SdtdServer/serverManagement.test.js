Feature('SdtdServer server management');

Scenario('Add a server', (I) => {
  I.addTestServer();
});

Scenario('Delete a server', (I) => {
  I.addTestServer();
  I.waitForElement("#delete-server-button", 10);
  I.click('Delete server');
  I.amOnPage("/");
  I.dontSee(sails.testServer.ip);
})
