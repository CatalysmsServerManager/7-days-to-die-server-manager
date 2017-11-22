Feature('SdtdServer management');

Scenario('Add a new server', (I) => {
    I.login('CSMMTesterFixture', 'something');
    I.amOnPage('/sdtdserver/addserver');
    I.fillField('serverip', '80.201.88.43');
    I.fillField('telnetport', '1337');
    I.fillField('telnetpassword', 'somethingtelnet');
    I.fillField('webport', '8082');
    I.click('Submit');
    I.see('Dashboard');
});

Scenario('Delete a server', (I) => {
    I.login('CSMMtest', 'secret');
    I.amOnPage('/sdtdserver/1/edit');
    I.click('Forget server');
    I.see('Server successfully deleted from CSMM');
});

Scenario('Edit a servers IP', (I) => {
    I.login('CSMMtest', 'secret');
    I.amOnPage('/sdtdserver/1/edit');
    I.fillField('ip', '109.134.143.236');
    I.click('Submit');
    I.see('Successfully changed ip');
})