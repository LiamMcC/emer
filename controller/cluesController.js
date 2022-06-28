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
      console.log(result[0].validSub)
    //    if ( result[0].validSub == true) {res.send("Your Membership Is Valid")}
    //    else { res.send("Your Membership Has expird please renew to continue playing")}
    //    return result
        
    });
   
}

router.get('/activeCompetitions',   function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 

    if (req.isAuthenticated()) {
        //let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and (userComps.userName = "'+req.user.userName+'" or userComps.userName is null)' 
        let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" ;' 
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
    
            res.render('activecompetitions', {result, user : req.user})
            
        });

} else {
    
    let sql = 'SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" ;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;

        res.render('activecompetitions', {result})
        
    });



}

   });




router.get('/check/:id/:clueID', isLoggedIn, function(req, res, next){ 

var thedude = req.user.userName


let sql = 'select * from userSubs where userName = "'+req.user.userName+'" order by Id DESC LIMIT 1';
// let sql = 'select  *  from clue where clueID = '+req.params.id+''
let query = db.query(sql, (err,result) => {
   if(err) throw err;
   if (result[0].validSub == true) {
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

   } 

   else { res.render("expiredSub")}
    
});
 


   });


 


   // *********** Remove this route when testing is complete 

   router.get('/test', function(req, res, next){ 
    
    //let sql = 'select currentProgress from userComps where userName = "'+thedude+'"'
    let sql = 'select * from userSubs order by Id DESC LIMIT 1; select now() as facePlant';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       let ms = Date.now();
       console.log(result[1][0].facePlant)
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
        let sql = 'select * from userSubs where userName = "'+req.user.userName+'" order by Id desc LIMIT 1';
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
          console.log(result[0].validSub)
           if ( result[0].validSub == true) {res.send("Your Membership Is Valid")}
           else { res.send("Your Membership Has expird please renew to continue playing")}
           
            
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
















router.get('/like/:clueID', function(req, res, next) {

    
let sql = 'update clue set cLikes = cLikes + 1 where clueId = "'+req.params.clueID+'"'
let query = db.query(sql,function (error, results, next) {
    if (error) throw error;
    
   // console.log(results)
    res.redirect("/activecompetitions")
  });


});






router.get('/addone', function(req, res, next) {
	
    

          res.render("addclue")
});

router.post('/addone', function(req, res, next){
    
    var hash = crypto.createHash('sha256');
    var q1 = req.body.clue1
    var data1 = hash.update(q1, 'utf-8');
    var q1hash = data1.digest('hex'); 

    var hash2 = crypto.createHash('sha256');
    var q2 = req.body.clue2
    var data2 = hash2.update(q2, 'utf-8');
    var q2hash = data2.digest('hex'); 

    var hash3 = crypto.createHash('sha256');
    var q3 = req.body.clue3
    var data3 = hash3.update(q3, 'utf-8');
    var q3hash = data3.digest('hex'); 

    var hash4 = crypto.createHash('sha256');
    var q4 = req.body.clue4
    var data4 = hash4.update(q4, 'utf-8');
    var q4hash = data4.digest('hex'); 

    var hash5 = crypto.createHash('sha256');
    var q5 = req.body.clue5
    var data5 = hash5.update(q5, 'utf-8');
    var q5hash = data5.digest('hex'); 
    
    
    let sql = 'insert into clue (clue1, clue2, clue3, clue4, clue5, cName, cPrize, q1Text, q2Text, q3Text, q4Text, q5Text, cDescription  ) values ("'+ q1hash+'", "'+ q2hash+'", "'+ q3hash+'", "'+ q4hash+'", "'+ q5hash+'", "'+ req.body.clueName+'", "'+ req.body.cluePrize+'", "'+ req.body.question1+'", "'+ req.body.question2+'", "'+ req.body.question3+'", "'+ req.body.question4+'", "'+ req.body.question5+'", "'+ req.body.description+'")'
    let query = db.query(sql,function (error, results, next) {
        if (error) throw error;
        
       // console.log(results)
        res.redirect("/activecompetitions")
      });
    



});


module.exports = router;



