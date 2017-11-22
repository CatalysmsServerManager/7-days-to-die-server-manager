Feature('User authentication');

Scenario('User register', (I) => {
    I.amOnPage('/register');
    I.fillField('username', 'CSMMtest');
    I.fillField('password', 'secret');
    I.click('Submit');
    I.see('Welcome to CSMM CSMMtest');
});

Scenario('User logout', (I) => {
    I.login('CSMMtest', 'secret');
    I.amOnPage('/logout');
    I.see('Makes managing a 7DTD server a piece of cake'); // homepage text
});

Scenario('User login', (I) => {
    I.amOnPage('/login');
    I.fillField('username', 'CSMMtest');
    I.fillField('password', 'secret');
    I.click('Submit');
    I.see('Welcome to CSMM CSMMtest');
});