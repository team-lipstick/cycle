const { assert } = require('chai');
const User = require('../../lib/models/user');

const mock = {
    name: 'Dexter Mongoose',
    email: 'mongoose@gmail.com',
    password: 'iHeartMongeese'
};

describe('User model', () => {
    it('validates good model', () => {
        const user = new User(mock);
        assert.equal(user.email, mock.email);
        assert.isUndefined(user.password);
    });

    it('generates a hash for the user model', () => {
        const user = new User(mock);
        user.generateHash(mock.password);
        assert.isDefined(user.hash);
    });
});