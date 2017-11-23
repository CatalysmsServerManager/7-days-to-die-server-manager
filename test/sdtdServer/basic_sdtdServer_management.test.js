Feature('SdtdServer management');

Scenario('Add a new server', (I) => {
    I.login('CSMMTesterFixture', 'something');
    I.addTestServer();
    I.see('Dashboard');
});

Scenario('Add a duplicate server', (I) => {
    I.login('CSMMTesterFixture', 'something');
    I.addTestServer();
    I.dontSee('Dashboard');

});

Scenario('Go to server dashboard', (I) => {
    I.login('CSMMTesterFixture', 'something');
    I.goToTestServerDashboard();
    I.see('Online Players');
})