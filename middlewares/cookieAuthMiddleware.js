const fs = require('fs');

function cookieAuthMiddleware(req, res, next) {
    next();

    if(req.cookies.remember != undefined && req.session.userLogged == undefined) {
        let usersJson = fs.readFileSync('users.json', {encoding: 'utf-8'});
        let users;
        if(usersJson == "") {
            users = [];
        } else {
            users = JSON.parse(usersJson);
        }
        let userToLogin;

        for(let i=0; i<users.length; i++) {
            if(users[i].email == req.cookies.remember) {
                userToLogin = users[i];
                break;
            }
        }

        req.session.userLogged = userToLogin;
    }
}

module.exports = cookieAuthMiddleware;