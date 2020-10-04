describe('BanEntry', () => {
  it('Ascii steam id should save properly', async () => {
    const entryId = (await BanEntry.create({
      steamId: '1234abc'
    }).fetch()).id
    const entry = await BanEntry.findOne(entryId);
    expect(entry.steamId).to.equal('1234abc')
  });
  it('Ahhh funky characters', async () => {
    const entryId = (await BanEntry.create({
      steamId: '💜♡  ᕼάˡᛕ𝐞𝔶Ｅ  😺♦',
    }).fetch()).id
    const entry = await BanEntry.findOne(entryId);
    expect(entry.steamId).to.equal('💜♡  ᕼάˡᛕ𝐞𝔶Ｅ  😺♦')
  });

});

