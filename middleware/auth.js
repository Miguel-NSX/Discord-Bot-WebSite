
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/auth/discord');
    }
    next();
}

module.exports = requireAuth;
