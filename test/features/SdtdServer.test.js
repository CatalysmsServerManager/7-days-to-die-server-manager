Feature('SdtdServer');

Scenario('Add a server', (I) => {
  I.addTestServer();
});

xScenario('Delete a server', (I) => {
  I.addTestServer();
  pause()
  I.click({
    id: "delete-server-button"
  });
  I.amOnPage("/");
  I.dontSee(sails.testServer.ip);
})
