Feature('User authentication');

Scenario('User register', (I) => {
    I.amOnPage('/register');
    I.fillField('username', 'newUser');
    I.fillField('password', 'secret');
    I.click('Submit');
    I.see('Welcome to CSMM newUser');
});

Scenario('User logout', (I) => {
    I.login('newUser', 'secret');
    I.amOnPage('/logout');
    I.see('Makes managing a 7DTD server a piece of cake'); // homepage text
});

Scenario('User login', (I) => {
    I.amOnPage('/login');
    I.fillField('username', 'newUser');
    I.fillField('password', 'secret');
    I.click('Submit');
    I.see('Welcome to CSMM newUser');
});