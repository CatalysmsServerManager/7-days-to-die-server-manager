const { expect } = require('chai');
const api = require('../../../../api/controllers/SdtdServer/add-server');

describe('Add server helpers', () => {


  describe('isPrivate', () => {

    it('Allows sign ups when not private', () => {
      process.env.CSMM_PRIVATE_INSTANCE = 'false';
      const res = api.privateCheck({ steamId: '76561198028175941' });
      expect(res).to.be.ok;

    });
    it('Does not allow sign ups when private and user is not admin', () => {
      sails.config.custom.adminSteamIds = [];
      process.env.CSMM_PRIVATE_INSTANCE = 'true';
      const res = api.privateCheck({ steamId: '76561198028175941' });
      expect(res).to.be.not.ok;
    });
    it('Allows sign ups when private and user is admin', () => {
      sails.config.custom.adminSteamIds = ['76561198028175941'];
      process.env.CSMM_PRIVATE_INSTANCE = 'true';
      const res = api.privateCheck({ steamId: '76561198028175941' });
      expect(res).to.be.ok;
    });

    it('Allows sign ups when not private and user is admin', () => {
      sails.config.custom.adminSteamIds = ['76561198028175941'];
      process.env.CSMM_PRIVATE_INSTANCE = 'false';
      const res = api.privateCheck({ steamId: '76561198028175941' });
      expect(res).to.be.ok;
    });

  });
  describe('donorCheck', () => {

    it('isDonorInstance = false, user = free', () => {
      process.env.CSMM_DONOR_ONLY = 'false';
      const res = api.donorCheck('free');
      expect(res).to.be.ok;
    });
    it('isDonorInstance = false, user = donor', () => {
      process.env.CSMM_DONOR_ONLY = 'false';
      const res = api.donorCheck('sponsor');
      expect(res).to.be.ok;
    });
    it('isDonorInstance = true, user = free', () => {
      process.env.CSMM_DONOR_ONLY = 'true';
      const res = api.donorCheck('free');
      expect(res).to.not.be.ok;
    });
    it('isDonorInstance = true, user = donor', () => {
      process.env.CSMM_DONOR_ONLY = 'true';
      const res = api.donorCheck('sponsor');
      expect(res).to.be.ok;
    });

  });

});
