Feature('User authentication');

xScenario('User login', (I) => {
    I.login();
    I.seeCookie('userProfile')
});

xScenario('User logout', (I) => {
    I.login();
    I.amOnPage('/auth/steam');
    I.dontSeeCookie('userProfile')
});

