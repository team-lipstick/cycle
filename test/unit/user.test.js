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

    it('makes sure hash and password are not equal', () => {
        const user = new User(mock);
        user.generateHash(mock.password);
        assert.notEqual(user.hash, mock.password);
        assert.isUndefined(user.validateSync());
    });

    it('correctly compares hash with original password', () => {
        const user = new User(mock);
        user.generateHash(mock.password);
        assert.isTrue(user.comparePassword(mock.password));
        assert.isFalse(user.comparePassword('badpassword'));
    });
});