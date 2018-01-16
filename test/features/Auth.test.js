Feature('Authentication');

Scenario('Login via steam', (I) => {
    I.loginSteam();
});

Scenario('Logout', (I) => {
    I.logout();
})
