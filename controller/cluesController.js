var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');

var crypto = require('crypto');
var Clues = require("../classes/clues.js");

router.get('/activeCompetitions',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    let sql = 'select * FROM clue where status = "active";';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.render('activecompetitions', {result})
    });

   });


router.get('/check/:id/:clueID',  function(req, res, next){ 
    
    let sql = 'select * FROM clue where status = "active" and clueID = '+req.params.id+'';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       a = req.params.id
       bother = req.params.clueID
       res.render('check', {a,bother, result})
        
    });


   


   });


  router.post('/check/:id/:clue',  function(req, res, next){  
    var whichClue = req.params.clue
    console.log("Which clue is " + whichClue)
    var de = req.body.firstClue
   var rew = req.params.id

 


    var theStatement = 'select  '+req.params.clue+'  from clue where clueID = '+req.params.id+''
    let sql = theStatement


    if (whichClue == "clue1") {
        
        
        let query = db.query(sql, (req, rows, next) => {
            var hash = crypto.createHash('sha256');
            var data = hash.update(de, 'utf-8');
            var generatedHash = data.digest('hex');
            console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
   if (rows[0].clue1 == generatedHash) {
       res.render("matchedClue")
       Clues.updateMax(2, rew)
       }
   else {
       res.render("wrongClue")
        }
   
  });
    
    
    } 
 else if (whichClue == "clue2"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
        console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
if (rows[0].clue2 == generatedHash) {
   res.render("matchedClue")
   Clues.updateMax(3, rew)
   }
else {
   res.render("wrongClue")
    }

});



 }
 else if (whichClue == "clue3"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
        console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
if (rows[0].clue3 == generatedHash) {
   res.render("matchedClue")
   Clues.updateMax(4, rew)
   }
else {
   res.render("wrongClue")
    }

});


 }
 else if (whichClue == "clue4"){
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
        console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
if (rows[0].clue4 == generatedHash) {
    res.render("matchedClue")
   Clues.updateMax(5, rew)
   }
else {
   res.render("wrongClue")
    }

}); 


 }
 else if (whichClue == "clue5"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
        console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
if (rows[0].clue5 == generatedHash) {
    res.render("solvedIt")
   
   Clues.updateStatus(whichClue, rew)
   }
else {
   res.render("wrongClue")
    }

});



 }
 else {"this has been solved"}
   
    
     
   });
















router.get('/liamstest', function(req, res, next) {
	console.log('It Looks like the individual routes work');
    res.render('index')
});



router.get('/sql', function(req, res, next) {
	
    let sql = 'select clue1 from clue where clueID = 1'
        let query = db.query(sql,function (error, results, next) {
            if (error) throw error;
            
            console.log(results)
            res.render("sql", {results})
          });


});




module.exports = router;



