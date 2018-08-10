const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        // If you have req.user.id, then don't depend on params!
        if(req.user.id !== req.params.userId) {
            next(new HttpError({
                code: 403,
                message: 'Invalid user'
            }));
        }
        next();
    };
};