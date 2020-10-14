const expect = require('chai').expect;
const manageServer = require('../../../api/policies/roles/manageServer');
const { mockResponse } = require('mock-req-res');

describe('Policies/roles - manageServer', function() {
  let rolesResponse;
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
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
    res = mockResponse();
    next = sandbox.mock();
    rolesResponse = {
      hasPermission: true,
      role: {name: 'someRoleHere'}
    };

    sandbox.stub(SdtdConfig, 'find').callsFake(() => ['random server']);
    sandbox.stub(SdtdServer, 'findOne').callsFake(() => sails.testServer);
    sandbox.stub(sails.helpers.roles, 'checkPermission').value({with: async () => rolesResponse});
  });

  it('Works when in ideal case', async function() {
    await manageServer(req, res, next);
    expect(next).to.have.been.calledOnce;
  });

  it('Throws 403 error when permCheck fails with wantsJSON is true ', async function() {
    rolesResponse.hasPermission = false;
    await manageServer(req, res, next);
    expect(res.status).to.have.been.calledWith(403);
    expect(next).to.have.not.been.called;
  });

  it('Calls res.view when permCheck fails and wantsJSON is false', async function() {
    rolesResponse.hasPermission = false;
    req.wantsJSON = false;
    await manageServer(req, res, next);
    expect(res.view).to.have.been.calledWith('meta/notauthorized');
    expect(next).to.not.have.been.called;
  });

  it('Redirects to /auth/steam for undefined user', async function(){
    req.session = {};
    await manageServer(req, res, next);
    expect(res.redirect).to.have.been.calledWith('/auth/steam');
    expect(next).to.have.not.been.called;
  });

  it('Sends badRequest when no serverId is provided', async function(){
    req._param = {};
    req.query = {};
    await manageServer(req, res, next);
    expect(res.badRequest).to.have.been.calledWith(`Error while running "manageServer" policy, could not determine server ID.`);
    expect(next).to.have.not.been.called;
  });
});
