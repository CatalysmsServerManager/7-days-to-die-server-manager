describe('HELPER sdtd/validate-item-name', () => {

  beforeEach(() => {
    sails.helpers.sdtdApi.executeConsoleCommand = sandbox.stub().returns({
      result: `    ammo9mmBulletBall
            Listed 1 matching items.`
    });
  });

  it('Validates an item', async () => {

    const trueResult = await sails.helpers.sdtd.validateItemName(sails.testServer.id, 'ammo9mmBulletBall');

    expect(trueResult).to.be.an('boolean');
    expect(trueResult).to.be.true;

    const falseResult = await sails.helpers.sdtd.validateItemName(sails.testServer.id, 'some nonexisting item');

    expect(falseResult).to.be.an('boolean');
    expect(falseResult).to.be.false;
  });

  it('Errors when no server is given', async () => {
    await expect(sails.helpers.sdtd.validateItemName(null, 'ammo9mmBulletBall')).to.eventually.be.rejectedWith(Error);
  });

  it('Errors when an unexisting server is given', async () => {
    const fakeServer = {};
    Object.assign(fakeServer, sails.testServer);

    fakeServer.id += 5;
    await expect(sails.helpers.sdtd.validateItemName(fakeServer.id, 'ammo9mmBulletBall')).to.eventually.be.rejectedWith(Error);
  });

  it('Throws when a request to the server fails', async () => {
    sails.helpers.sdtdApi.executeConsoleCommand = sandbox.stub().throws(Error);
    await expect(sails.helpers.sdtd.validateItemName(sails.testServer.id, 'ammo9mmBulletBall')).to.eventually.be.rejectedWith(Error);
  });
});




