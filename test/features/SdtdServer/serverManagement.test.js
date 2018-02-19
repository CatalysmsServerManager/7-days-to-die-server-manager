Feature('SdtdServer server management');

Scenario('Add a server', (I) => {
  I.loginSteam();
  I.addTestServer();
  I.deleteTestServer()
});


Scenario('Delete a server', (I) => {
  I.loginSteam();
  I.addTestServer();
  I.deleteTestServer()
  I.dontSee(process.env.CSMM_TEST_SERVERNAME);
})
