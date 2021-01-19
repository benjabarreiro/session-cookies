const fs = require('fs');
const {check, validationResult, body} = require('express-validator');
const bcrypt = require('bcrypt');

module.exports = {
    register: function(req, res) {
        res.render('register');
    },
    store: function(req, res) {

        let errors = validationResult(req);
        
        if(errors.isEmpty()) {
            let user = {
                username: req.body.username,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10)
            };
    
            let usersJson = fs.readFileSync('users.json', {encoding: 'utf-8'});
            let users;
            if(usersJson == "") {
                users = [];
            } else {
                users = JSON.parse(usersJson);
            }
    
            users.push(user);
    
            usersJson = JSON.stringify(users);
    
            fs.writeFileSync('users.json', usersJson);
    
            res.redirect('/users/login');
        } else {
            res.render('register', {errors: errors.errors});
        }
    },
    login: function(req, res) {
        res.render('login');
    },
    processLogin: function(req, res) {
        let errors = validationResult(req);

        if(errors.isEmpty()) {
            let usersJson = fs.readFileSync('users.json', {encoding: 'utf-8'});
            let users;
            if(usersJson == "") {
                users = [];
            } else {
                users = JSON.parse(usersJson);
            }

            let userToLogin;

            for(let i=0; i<users.length; i++) {
                if(users[i].email == req.body.email) {
                    userToLogin = users[i];
                    break;
                }
            }

            if(userToLogin == undefined) {
                res.render('login', {errors: [
                    {msg: 'Invalid credentials'}
                ]});
            }

            req.session.userLogged = userToLogin;

            if(req.body.remember != undefined) {
                res.cookie('remember', userToLogin.email, {maxAge: 60000});
            }

            res.render('success');
        } else {
            res.render('login', {errors: errors.errors});
        }
    }
}