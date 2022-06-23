var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));




var db = require('./db');
var Static = require("./classes/static.js");
var Clues = require("./classes/clues.js");
var crypto = require('crypto');

// *** These are the routes to call the functions in the controllers
router.use(require('./controller/staticpagesController'))
router.use(require('./controller/cluesController'))
router.use(require('./controller/userController'))



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
