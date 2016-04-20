var express = require('express');
var router = express.Router();

module.exports = function(passport){

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        var m1 = req.flash('error')[0]
        console.log("error "+ m1)
        res.send({state: 'failure', user: null, message: m1});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        failureFlash: true 
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure',
        failureFlash: true 
       
    }));

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    }); 
    
     router.route('/getUser')
    //gets specified post
    .get(function(req, res){       
       res.send(req.user);

    });
    
    return router;

}