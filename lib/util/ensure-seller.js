const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        if(req.user.id !== req.params.userId) {
            next(new HttpError({
                code: 403,
                message: 'Invalid user'
            }));
        }
        next();
    };
};