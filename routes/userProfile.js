var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
var multer = require('multer');
var fs = require('fs');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods    
    //if(req.method === "GET"){
    //    return next();
    //}
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);

//api for a specfic post
router.route('/:id')
    //gets specified post
    .get(function(req, res){       
        User.findById(req.param('id'), function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });

    })   
    .put(function(req, res) {
           User.findById(req.param('id'), function(err, user){            
                
                user.username = req.body.username;
                user.firstname = req.body.firstname;
                user.lastname = req.body.lastname;
                user.shippingAddress = req.body.shippingAddress;
                user.billingAddress = req.body.billingAddress;
                console.log(req.body.billingAddr);
                console.log(user.BillingAddr);            
                user.email = req.body.email;                       
                user.save(function(err, user){
                    if(err)                        
                        res.send({state: 'failure', user:user, message: "Failed to update profile"});

                    res.send({state: 'success', user:user, message: "Profile updated successfully"});
                });
                
            });
        });

router.route('/changePassword/:id')
    .put(function(req, res) {
           User.findById(req.param('id'), function(err, user){            
                console.log(user.password);
                console.log(req.body.password);
                if (!isValidPassword(user, req.body.password)){
                            console.log('Invalid Password');
                            res.send({state: 'failure', user:user, message: "Invalid password"});
                }          
                else{                   
                    user.password = createHash(req.body.newPasswordOne);               
                    user.save(function(err, user){
                        if(err)
                            res.send({state: 'failure', user:user, message: "Failed to change password"});

                        res.send({state: 'success', user:user, message: "Password changed successfully"});
                    });
                }
            });
        });

router.route('/upload/')
    .post(function(req, res) {      
                       var data = new Buffer('');
                          req.on('data', function(chunk) {
                          data = Buffer.concat([data, chunk]);
                       });
                       req.on('end', function() {
                              req.rawBody = data;     
                              fs.writeFile(config.root + path.sep + 'public/upload' +                    path.sep + uuid.v1(), data ,function(err){
                             if(err) throw err;
                              console.log('ok saved')

                       });
                       res.send('ok');

                    });
              })


   

    var isValidPassword = function(user, password){
        return bCrypt.compareSync(password, user.password);
    };
    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    };

module.exports = router;
    