var express = require('express');
var router = express.Router();

var mongoose = require( 'mongoose' );
var Product = mongoose.model('Product');
var multer = require('multer');


var storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            cb(null, './public/img/products/')
        },
        filename: function (req, file, cb) {
            console.log(file);
            var datetimestamp = Date.now();
            cb(null, file.originalname)
        }
    });
var upload = multer({ //multer settings
                    storage: storage
                }).single('file');

//Used for routes that must be authenticated.
function isAuthenticated (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects

    //allow all get request methods    
    if(req.method === "GET"){
        return next();
    }
    if (req.isAuthenticated()){
        return next();
    }

    // if the user is not authenticated then redirect him to the login page
    return res.redirect('/#login');
};

//Register the authentication middleware
router.use('/', isAuthenticated);

router.route('/all/')
	//creates a new post
	.post(function(req, res){
        console.log(req.body.image);
		var product = new Product();
        product.title = req.body.title;
        product.author = req.body.author;
        product.description = req.body.description;
        product.category = req.body.category;
        product.image = req.body.image;
        product.price = req.body.price;
        product.stock = req.body.stock;
        product.status = req.body.status;
		product.save(function(err, post) {
			if (err){
                console.log(err);
				return res.send(500, err);
			}
			return res.json(product);
		});
	})
	//gets all posts
	.get(function(req, res){
		console.log('getAllProducts-1');
		Product.find(function(err, products){
			console.log('getAllProducts-2');
			if(err){
				return res.send(500, err);
			}
			return res.send(200,products);
		});
	});

//api for a specfic post
router.route('/id/:id')
    //gets specified post
    .get(function(req, res){     
        console.log('getProductsById-1');  
        Product.findById(req.param('id'), function(err, post){
            if(err)
                res.send(err);
            res.json(post);
        });

    })
    .put(function(req, res) {
           Product.findById(req.param('id'), function(err, product){            
                console.log('updateProductsById-1');  
                product.title = req.body.title;
                product.author = req.body.author;
                product.description = req.body.description;
                product.category = req.body.category;
                product.image = req.body.image;
                product.price = req.body.price;
                product.stock = req.body.stock;
                product.status = req.body.status;  
                product.save(function(err, product){
                    if(err)                        
                        res.send({state: 'failure', product:product, message: "Failed to update product"});

                    res.send({state: 'success', product:product, message: "Product updated successfully"});
                });
                
            });
        });

router.route('/search/')
    .get(function(req, res){
        var regex = new RegExp(req.query.searchText, "i");
        var limit = parseInt(req.query.limit);
        var skip = parseInt(req.query.skip);          
        Product.find( { $or:[ {'title':regex}, {'description':regex} ]},null,{limit: limit , skip: skip}).exec(function(err, products){
            Product.find( { $or:[ {'title':regex}, {'description':regex} ]}).count().exec(function(err, count){
                res.send({data: products, items:count})
            })
        });
    
       })
       
router.route('/searchGrid/')
    .get(function(req, res){
        var regex = new RegExp(req.query.searchText, "i");
        var limit = parseInt(req.query.limit);
        var skip = parseInt(req.query.skip);          
        Product.find( {$and:[{ $or:[ {'title':regex}, {'description':regex} ]},{'status':'Active'}]},null,{limit: limit , skip: skip}).exec(function(err, products){
            Product.find( {$and:[{ $or:[ {'title':regex}, {'description':regex} ]},{'status':'Active'}]}).count().exec(function(err, count){
                res.send({data: products, items:count})
            })
        });
    
       })

router.route('/upload/')
    .post(function(req, res) {
        upload(req,res,function(err){
            if(err){
                 console.log(err);
                 res.json({error_code:1,err_desc:err});
                 return;
            }
             res.json({error_code:0,err_desc:null});
        })
       
    })


module.exports = router;
    