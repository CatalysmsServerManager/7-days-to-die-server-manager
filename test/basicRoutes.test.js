Feature('Basic routing (homepage, login, about,...)');

Scenario('Homepage', (I) => {
    I.say('I am going to the homepage');
    I.amOnPage('/');
    I.see('CSMM');
});

Scenario('About', (I) => {
    I.say('I am going to the about page');
    I.amOnPage('/about');
    I.see('About');
})