var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');

var crypto = require('crypto');
var Clues = require("../classes/clues.js");
router.use(require('./userController'))

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

router.get('/activeCompetitions',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 
    let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active";' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.render('activecompetitions', {result})
        
    });

   });


router.get('/check/:id/:clueID', isLoggedIn, function(req, res, next){ 
    var thedude = req.user.userName
    let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and clueID = '+req.params.id+';';
    // let sql = 'select  *  from clue where clueID = '+req.params.id+''
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       a = req.params.id
       bother = req.params.clueID
       x = result[1]
       console.log(bother)
       res.render('check', {a,bother, result, x})
        
    });


   


   });


   // *********** Remove this route when testing is complete 

   router.get('/test', isLoggedIn, function(req, res, next){ 
    var thedude = req.user.userName
    //let sql = 'select currentProgress from userComps where userName = "'+thedude+'"'
    let sql = 'select * FROM clue where status = "active" and clueID = (select currentProgress from userComps where userName = "'+thedude+'")';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       a = req.params.id
       bother = req.params.clueID
       console.log(result[0].currentProgress)
       res.send("Hello")
        
    });


   


   });

   // **** Remove the above route when testing is complete


  router.post('/check/:id/:clue',  function(req, res, next){  
    var whichClue = req.params.clue
    console.log("Which clue is " + whichClue)
    var de = req.body.firstClue
   var rew = req.params.id
var thedude = req.user.userName



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
       Clues.newUserLevel(thedude, rew, 2 )
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
   Clues.updateUserLevel(thedude, rew, 3 )
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
   Clues.updateUserLevel(thedude, rew, 4 )
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
   Clues.updateUserLevel(thedude, rew, 5 )
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
  Clues.weHaveAWinner(rew, "Liam");
   Clues.updateStatus(whichClue, rew)
   Clues.updateUserLevel(thedude, rew, 5 )
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



