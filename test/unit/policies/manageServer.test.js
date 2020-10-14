const expect = require('chai').expect;
const manageServer = require('../../../api/policies/roles/manageServer');

describe('Policies/roles - manageServer', function() {
  let rolesResponse;
  beforeEach(() => {
    rolesResponse = {
      hasPermission: true,
      role: {name: 'someRoleHere'}
    };
    res = {
      status: () => { return res; },
      json: () => {},
    };
    sandbox.stub(SdtdConfig, 'find').callsFake(() => ['random server']);
    sandbox.stub(SdtdServer, 'findOne').callsFake(() => sails.testServer);
    sandbox.stub(sails.helpers.roles, 'checkPermission').value({with: async () => rolesResponse});
  });

  it('Works when in ideal case', async function() {
    const req = {
      session: {
        user: {
          id: 13464687,
          username: 'test user'
        }
      },
      query: {
        serverId: 1
      },
      _param: {
        serverId: 1
      },
      param(key){return req._param[key];},
      path: 'some/random/path/',
      wantsJSON: true
    };
    const next = sandbox.mock();
    await manageServer(
      req,
      res,
      next
    );
    expect(next).to.have.been.calledOnce;
  });

  it('Throws 403 error for invalid permissions', async function() {
    const req = {
      session: {
        user: {
          id: 13464687,
          username: 'test user'
        }
      },
      query: {
        serverId: 1
      },
      _param: {
        serverId: 1
      },
      param(key){return req._param[key];},
      path: 'some/random/path/',
      wantsJSON: true
    };
    rolesResponse.hasPermission = false;
    const next = sandbox.mock();
    res = await manageServer(
      req,
      res,
      next
    );
    sails.log.warn(`res: ${JSON.stringify(res)}`);
    expect(res.status).to.be.equal(403);
    expect(next).to.have.not.been.called;
  });

});
