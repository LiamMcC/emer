var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');

router.use(require('./userController'))
// Define the home page route
router.get('/', function(req, res) {

    let sql = 'select dateWon FROM winners' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('index', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });

    

});


router.get('/about', function(req, res, next) {
    console.log('It Looks like the individual routes work');
    res.render('about',{
        user : req.user // get the user out of session and pass to template
    })
});



router.get('/adminarea', function(req, res, next) {
    console.log('It Looks like the individual routes work');
    res.render('adminarea',{
        user : req.user // get the user out of session and pass to template
    })
});

module.exports = router;



