Feature('User authentication');

Scenario('User login', (I) => {
    I.amOnPage('/login');
    I.fillField('Username', 'CSMMTEST');
    I.fillField('Password', 'secret');
    I.click('Login');
    I.see('Welcome back, CSMMTEST');
});

Scenario('User logout', (I) => {
    I.amOnPage('/logout');
    I.see('Successfully logged out');
});

Scenario('User register', (I) => {
    I.amOnPage('/register');
    I.fillField('username', 'newUser');
    I.fillField('password', 'secret');
    I.click('Submit');
    I.see('Welcome to CSMM newUser');
})