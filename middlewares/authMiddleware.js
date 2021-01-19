function authMiddleware(req, res, next) {
    if(req.session.userLogged != undefined) {
        next();
    } else {
        res.send('This page is only for users');
    }
}

module.exports = authMiddleware;