Feature('Player features');

// All these tests start on server dashboard

Before((I) => {
  I.loginSteam();
  I.addTestServer();
});

After((I) => {
  I.deleteTestServer();
})

Scenario('See online players on dashboard', (I) => {
  I.see('Online players');
});

Scenario('View full player list', (I) => {
  I.click('View all players');
  I.see('Name');
  I.see('Location');
  I.click('Back to dashboard')
});
