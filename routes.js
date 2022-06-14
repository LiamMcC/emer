var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));



//app.use(express.static("views")); // Allow access to views folder

var db = require('./db');
var Static = require("./controller/static.js");
var Clues = require("./controller/clues.js");
var crypto = require('crypto');

//const mw = require('./controller/clueQuery.js')
//router.use(mw())

// Define the home page route
router.get('/', function(req, res) {
    res.render('index')
});

// Define the about route
router.get('/about', function(req, res) {
    var message1 = Static.about()
  res.send(message1);
});


router.get('/clue1', function(req, res) {
    var message1 = Clues.hashClue1().generatedHash
    var message1o = Clues.hashClue1().original
  res.send(message1 + " and the original " + message1o);
});


router.get('/reviews',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    let sql = 'select * from clue where clueID = 1'
     let query = db.query(sql, (err, res1) => {
       res.send(res1);
       next(err) ;
     });
    
     console.log("Now you are on the products page!");
   });



module.exports = router;
