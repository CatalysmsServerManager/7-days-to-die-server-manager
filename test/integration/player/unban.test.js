const supertest = require('supertest');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('post /api/player/unban', function () {

  it('should return 200 with valid data', function () {
    const spy = sandbox.stub(sails.helpers.sdtdApi, 'executeConsoleCommand');

    return supertest(sails.hooks.http.app)
      .post('/api/player/unban')
      .query({
        playerId: sails.testPlayer.id
      })
      .expect(200)
      .then(async () => {
        expect(spy).to.have.been.calledWith(sinon.match.any, `ban remove Steam_${sails.testPlayer.steamId}`);
      });
  });

});
