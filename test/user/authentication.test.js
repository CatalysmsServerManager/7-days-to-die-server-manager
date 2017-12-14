Feature('User authentication');

Scenario('User login', (I) => {
    I.login();
    I.seeCookie('userProfile')
});

Scenario('User logout', (I) => {
    I.login();
    I.amOnPage('/auth/steam');
    I.dontSeeCookie('userProfile')
});

