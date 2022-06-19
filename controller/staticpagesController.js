var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');



// Define the home page route
router.get('/', function(req, res) {
    res.render('index')
//Clues.liamo()
});


router.get('/about', function(req, res, next) {
	console.log('It Looks like the individual routes work');
    res.render('about')
});

module.exports = router;



