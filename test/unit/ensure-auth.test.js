const { assert } = require('chai');
const createEnsureAuth = require('../../lib/util/ensure-auth');
const tokenService = require('../../lib/util/token-service');

describe('Ensure auth middleware', () => {

    const user = { _id: 456 };
    let token = '';
    beforeEach(() => {
        return tokenService.sign(user)
            .then(t => token = t);
    });

    const ensureAuth = createEnsureAuth();

    it('Adds payload as req.user on success', done => {
        const req = {
            get(header) {
                if(header === 'Authorization') return token;
            }
        };
        const next = () => {
            assert.equal(req.user.id, user._id, 'payload is assigned to req as user');
            done();
        };
        ensureAuth(req, null, next);
    });

    it('Calls next with error when token is bad', done => {
        const req = {
            get() { return 'bad-token'; }
        };
        const next = err => {
            assert.equal(err.code, 401);
            done();
        };
        ensureAuth(req, null, next);
    });
});