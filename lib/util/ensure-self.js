const { HttpError } = require('./errors');

module.exports = function createEnsureSelf() {
    return (req, res, next) => {
        // useless because caller can just put their id in body._id or body.owner
        if(!(req.user.id === req.body._id || req.user.id === req.body.owner)) {
            next(new HttpError({
                code: 403,
                message: 'Invalid user'
            }));
        }
        next();
    };
};