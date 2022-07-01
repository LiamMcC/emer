var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');
var crypto = require('crypto');
var Clues = require("../classes/clues.js");
router.use(require('./userController'))
// Define the home page route

function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
    
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

function isAdmin(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.user.adminRights)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/about');
}

router.get('/adminarea', isLoggedIn, isAdmin, function(req, res, next) {
   
    res.render('adminarea',{
        user : req.user // get the user out of session and pass to template
    })
});



router.get('/adminallusers', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'SELECT * FROM users left JOIN userSubs ON users.userName=userSubs.userName group by users.userName;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('adminallusers', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });
    


});


router.get('/adminallwinners', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'select winners.*, clue.cName from winners JOIN clue ON winners.comp=clue.clueId order by Id DESC ;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('adminallwinners', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });
    


});


router.get('/admincurrentcomps', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'select * from clue where status ="active" order by clueID DESC;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('admincurrentcomps', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });
    


});

router.get('/adminpastcomps', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'SELECT * FROM clue left JOIN winners ON clue.clueID=winners.comp where status = "solved" order by clueID DESC' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('adminpastcomps', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });
    


});




router.post('/intestclue/:id/:clue',  function(req, res, next){  
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
       res.redirect("/intestclue/"+rew+"/clue2")
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
    res.redirect("/intestclue/"+rew+"/clue3")
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
    res.redirect("/intestclue/"+rew+"/clue4")
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
    res.redirect("/intestclue/"+rew+"/clue5")
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
    res.redirect("/activecompetitions")
  Clues.setItLive(rew);
  Clues.setItLiveForAllUsers(rew)
   
   
   }
else {
   res.render("wrongClue")
    }

});



 }
 else {"this has been solved"}
   
    
     
   });

   

module.exports = router;



