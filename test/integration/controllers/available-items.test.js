const supertest = require('supertest');
const { expect } = require('chai');

describe('GET Available items', function () {

  it('Should return an array of items', async function () {
    sandbox.stub(sails.helpers.sdtdApi,'executeConsoleCommand').resolves({'command':'listitems','parameters':'test','result':'    cntBruteStyleTrashCanEmpty\n    cntBruteStyleTrashCanFull\n    cntBruteStyleTrashCanRandomLootHelper\n    cntQuestTestLoot\n    TestCubeP\n    TestCubeA\n    TestCubeC\n    TestCubeY\n    TestCubeO\n    rampCornerCutoutTest\n    curve_3x3x1TEST\n    turret_3x3TEST\n    turret_4x4x6TEST\n    elevatorTest\n    rampGutterTest\n    rampGutterOutsideCornerTest\n    cube3mTest\n    qtest_nextTraderAdmin\n    resourceTestosteroneExtract\n    noteTestersDelightAdmin\n    noteTestersElectricityAdmin\n    bookPistolPeteSteadyHand\nListed 22 matching items.\n'});
    const response = await supertest(sails.hooks.http.app).get(`/api/sdtdserver/availableitems?serverId=${sails.testServer.id}&item=*`);
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an('array');
    expect(response.body).to.have.lengthOf(22);
    expect(response.body).to.deep.equal([
      'cntBruteStyleTrashCanEmpty',
      'cntBruteStyleTrashCanFull',
      'cntBruteStyleTrashCanRandomLootHelper',
      'cntQuestTestLoot',
      'TestCubeP',
      'TestCubeA',
      'TestCubeC',
      'TestCubeY',
      'TestCubeO',
      'rampCornerCutoutTest',
      'curve_3x3x1TEST',
      'turret_3x3TEST',
      'turret_4x4x6TEST',
      'elevatorTest',
      'rampGutterTest',
      'rampGutterOutsideCornerTest',
      'cube3mTest',
      'qtest_nextTraderAdmin',
      'resourceTestosteroneExtract',
      'noteTestersDelightAdmin',
      'noteTestersElectricityAdmin',
      'bookPistolPeteSteadyHand',
    ]);
  });


});

