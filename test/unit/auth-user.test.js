const { assert } = require('chai');
const User = require('../../lib/models/auth-user');

describe('Auth-user model', () => {

    it('Validates Auth-User model', () => {
        const data = {
            email: 'me@me.com',
            password: '123',
            roles: ['admin']
        };

        const user = new User(data);
        assert.equal(user.email, data.email);
        assert.isUndefined(user.password, 'Password should be not set');


    });
});