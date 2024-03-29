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

function isAdmin(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.user.adminRights)
		return next();

	// if they aren't redirect them to the home page
	res.send('you are no admin');
}




function isPaidUp(req, res, next) {
    let sql = 'select * from userSubs where userName = "'+req.user.userName+'" order by Id DESC LIMIT 1';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
    
    //    if ( result[0].validSub == true) {res.send("Your Membership Is Valid")}
    //    else { res.send("Your Membership Has expird please renew to continue playing")}
    //    return result
        
    });
   
}

router.get('/activeCompetitions',   function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 

    if (req.isAuthenticated()) {
        //let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and (userComps.userName = "'+req.user.userName+'" or userComps.userName is null)' 
        let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and userComps.userName = "'+req.user.userName+'" group by clueID;' 
        let query = db.query(sql, (err,result) => {
         var stuffLiam = req.cookies.theyLikeCookies
           if(err) throw err;
    
            res.render('activecompetitions', {result, user : req.user, stuffLiam})
            
        });

} else {
    
    let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" group by clueID;' 
    let query = db.query(sql, (err,result) => {
      var stuffLiam = req.cookies.theyLikeCookies
       if(err) throw err;

        res.render('activecompetitions', {result, stuffLiam})
        
    });



}

   });




router.get('/check/:id/:clueID', isLoggedIn, function(req, res, next){ 

var thedude = req.user.userName
var stuffLiam = req.cookies.theyLikeCookies

let sql = 'select * from userSubs where userName = "'+req.user.userName+'" order by Id DESC LIMIT 1';
// let sql = 'select  *  from clue where clueID = '+req.params.id+''
let query = db.query(sql, (err,result) => {
   if(err) throw err;
   if (result[0].validSub == true) {
    let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and clueID = '+req.params.id+' and userName = "'+req.user.userName+'";';
    // let sql = 'select  *  from clue where clueID = '+req.params.id+''
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       a = req.params.id
      
       bother = req.params.clueID
       x = result[1]
      
       
       res.render('check', {a,bother, result, x, stuffLiam})
        
    });

   } 

   else { res.render("expiredSub", {stuffLiam })}
    
});
 


   });


   router.get('/pendingcomps',   function(req, res, next){  // I have this restricted for admin just for proof of concept
      //let sql = 'select * FROM clue where status = "active"; ' 
  
      if (req.isAuthenticated()) {
          //let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and (userComps.userName = "'+req.user.userName+'" or userComps.userName is null)' 
          let sql = 'SELECT * FROM clue  where clue.status= "inTest" ;' 
          let query = db.query(sql, (err,result) => {
            var stuffLiam = req.cookies.theyLikeCookies
             if(err) throw err;
      
              res.render('pendingcomps', {result, user : req.user, stuffLiam})
              
          });
  
  } else {
      
     
  
          res.render('activecompetitions', {result})
          
    
  
  
  
  }
  
     });



   router.get('/intestclue/:id/:clueID', isLoggedIn, function(req, res, next){ 

      var thedude = req.user.userName
      
      
      let sql = 'select * from users where userName = "'+req.user.userName+'" order by Id DESC LIMIT 1';
      // let sql = 'select  *  from clue where clueID = '+req.params.id+''
      let query = db.query(sql, (err,result) => {
         if(err) throw err;
         if (result[0].adminRights == true) {
          let sql = 'SELECT * FROM clue where clue.status= "inTest" and clueID = '+req.params.id+' ;';
          // let sql = 'select  *  from clue where clueID = '+req.params.id+''
          let query = db.query(sql, (err,result) => {
             if(err) throw err;
             a = req.params.id
            
             bother = req.params.clueID
             x = result[1]
            
             var stuffLiam = req.cookies.theyLikeCookies
             res.render('intestclue.ejs', {a,bother, result, x, stuffLiam})
              
          });
      
         } 
      
         else { res.render("expiredSub", {stuffLiam})}
          
      });
       
      
      
         });
      
      


 


   // *********** Remove this route when testing is complete 

   router.get('/test', function(req, res, next){ 
    
    //let sql = 'select currentProgress from userComps where userName = "'+thedude+'"'
    let sql = 'select * from userSubs order by Id DESC LIMIT 1; select now() as facePlant';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       let ms = Date.now();
     
       var x1 = result[0][0].datePaid
       var x2 = result[1][0].facePlant
       var xDifference = (x2 - x1) /1000
       var oldDateAge = (1 * 60 * 60 );
       if ( xDifference > oldDateAge) {console.log("Expired")}
       res.send("Hello the date paid is " + result[0][0].datePaid + "<br><br> the server date is " + result[1][0].facePlant + "<br><br>the difference is " + xDifference + "24 hours is " + oldDateAge + " <br><br>You should expire after at 11:01")
        
    });

      });


      router.get('/x', function(req, res, next){ 
    
        //let sql = 'select currentProgress from userComps where userName = "'+thedude+'"'
        let sql = 'select * FROM clue';
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
           result.forEach(function(row) {
            let sql = 'INSERT INTO userComps (userName, comp, currentProgress) values ("Alex", '+row.clueID+', 0)';
            let xxx = db.query(sql);
          
          });
           res.send("Check Data")
            
        });
    
          });

   // **** Remove the above route when testing is complete


  router.post('/check/:id/:clue',  function(req, res, next){  
    var whichClue = req.params.clue
 
    var de = req.body.firstClue
   var rew = req.params.id
var thedude = req.user.userName

var stuffLiam = req.cookies.theyLikeCookies

    var theStatement = 'select  '+req.params.clue+'  from clue where clueID = '+req.params.id+''
    let sql = theStatement


    if (whichClue == "clue1") {
        
        
        let query = db.query(sql, (req, rows, next) => {
            var hash = crypto.createHash('sha256');
            var data = hash.update(de, 'utf-8');
            var generatedHash = data.digest('hex');
        
   if (rows[0].clue1 == generatedHash) {
       res.render("matchedClue", {stuffLiam})
       Clues.updateMax(2, rew)
       Clues.updateUserLevel(thedude, rew, 2 )
       }
   else {
       res.render("wrongClue", {stuffLiam})
        }
   
  });
    
    
    } 
 else if (whichClue == "clue2"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
       
if (rows[0].clue2 == generatedHash) {
   res.render("matchedClue", {stuffLiam})
   Clues.updateMax(3, rew)
   Clues.updateUserLevel(thedude, rew, 3 )
   }
else {
   res.render("wrongClue", {stuffLiam})
    }

});



 }
 else if (whichClue == "clue3"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
       
if (rows[0].clue3 == generatedHash) {
   res.render("matchedClue", {stuffLiam})
   Clues.updateMax(4, rew)
   Clues.updateUserLevel(thedude, rew, 4 )
   }
else {
   res.render("wrongClue", {stuffLiam})
    }

});


 }
 else if (whichClue == "clue4"){
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
      
if (rows[0].clue4 == generatedHash) {
    res.render("matchedClue", {stuffLiam})
   Clues.updateMax(5, rew)
   Clues.updateUserLevel(thedude, rew, 5 )
   }
else {
   res.render("wrongClue", {stuffLiam})
    }

}); 


 }
 else if (whichClue == "clue5"){
     
    let query = db.query(sql, (req, rows, next) => {
        var hash = crypto.createHash('sha256');
        var data = hash.update(de, 'utf-8');
        var generatedHash = data.digest('hex');
     
if (rows[0].clue5 == generatedHash) {
    res.render("solvedIt", {stuffLiam})
  Clues.weHaveAWinner(rew, "Liam");
   Clues.updateStatus(whichClue, rew)
   Clues.updateUserLevel(thedude, rew, 5 )
   }
else {
   res.render("wrongClue", {stuffLiam})
    }

});



 }
 else {"this has been solved"}
   
    
     
   });
















router.get('/like/:clueID', function(req, res, next) {

    
let sql = 'update clue set cLikes = cLikes + 1 where clueId = "'+req.params.clueID+'"'
let query = db.query(sql,function (error, results, next) {
    if (error) throw error;
    
   
    res.redirect("/activecompetitions")
  });


});



















module.exports = router;



