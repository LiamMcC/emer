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
   
// update all cookies that are older than 90 days when this url is called
    // let sql = 'update users set cookies older than 90 days to false' 
    // let query = db.query(sql, (err,result) => {
    //    if(err) throw err;
    //    res.render('adminallusers', {
    //     user : req.user,result // get the user out of session and pass to template
    // });
    var stuffLiam = req.cookies.theyLikeCookies

    res.render('adminarea',{
        user : req.user, stuffLiam // get the user out of session and pass to template
    })
});



router.get('/adminallusers', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'SELECT * FROM users left JOIN userSubs ON users.userName=userSubs.userName group by users.userName;' 
    let query = db.query(sql, (err,result) => {
        var stuffLiam = req.cookies.theyLikeCookies
       if(err) throw err;
       res.render('adminallusers', {
        user : req.user,result, stuffLiam // get the user out of session and pass to template
    });
       
        
    });
    


});

router.get('/adminsitedetails', isLoggedIn, isAdmin, function(req, res, next) {
    
    // let sql = 'SELECT * FROM clue left JOIN winners ON clue.clueID=winners.comp where status = "solved" order by clueID DESC' 
    // let query = db.query(sql, (err,result) => {
    //    if(err) throw err;
    //    res.render('adminsitedetails', {
    //     user : req.user,result // get the user out of session and pass to template
    // });
       
        
    // });
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('adminsitedetails', {stuffLiam})

});





router.get('/adminallwinners', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'select winners.*, clue.cName from winners JOIN clue ON winners.comp=clue.clueId order by Id DESC ;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       var stuffLiam = req.cookies.theyLikeCookies
       res.render('adminallwinners', {
        user : req.user,result, stuffLiam // get the user out of session and pass to template
    });
       
        
    });
    


});


router.get('/admincurrentcomps', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'select * from clue where status ="active" order by clueID DESC;' 
    let query = db.query(sql, (err,result) => {
        var stuffLiam = req.cookies.theyLikeCookies
       if(err) throw err;
       res.render('admincurrentcomps', {
        user : req.user,result, stuffLiam // get the user out of session and pass to template
    });
       
        
    });
    


});

router.get('/adminpastcomps', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'SELECT * FROM clue left JOIN winners ON clue.clueID=winners.comp where status = "solved" order by clueID DESC' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       var stuffLiam = req.cookies.theyLikeCookies
       res.render('adminpastcomps', {
        user : req.user,result, stuffLiam // get the user out of session and pass to template
    });
       
        
    });
    


});




router.post('/intestclue/:id/:clue',  function(req, res, next){  
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
       res.redirect("/intestclue/"+rew+"/clue2")
       Clues.updateMax(2, rew)
       
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
    res.redirect("/intestclue/"+rew+"/clue3")
   Clues.updateMax(3, rew)
   
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
    res.redirect("/intestclue/"+rew+"/clue4")
   Clues.updateMax(4, rew)
   
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
    res.redirect("/intestclue/"+rew+"/clue5")
   Clues.updateMax(5, rew)
   
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
        console.log("The user entered " + de + " the answer is " + generatedHash + " on clue "  )
if (rows[0].clue5 == generatedHash) {
    res.redirect("/activecompetitions")
  Clues.setItLive(rew);
  Clues.setItLiveForAllUsers(rew)
   
   
   }
else {
   res.render("wrongClue", {stuffLiam})
    }

});



 }
 else {"this has been solved"}
   
    
     
   });




   router.get('/addone', isLoggedIn, isAdmin,function(req, res, next) {
	
    var stuffLiam = req.cookies.theyLikeCookies

    res.render("addclue", {stuffLiam})
});

router.post('/addone', isLoggedIn, isAdmin, function(req, res, next){

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


let sql = 'insert into clue (clue1, clue2, clue3, clue4, clue5, cName, cPrize, q1Text, q2Text, q3Text, q4Text, q5Text, cDescription , status, cLikes ) values ("'+ q1hash+'", "'+ q2hash+'", "'+ q3hash+'", "'+ q4hash+'", "'+ q5hash+'", "'+ req.body.clueName+'", "'+ req.body.cluePrize+'", "'+ req.body.question1+'", "'+ req.body.question2+'", "'+ req.body.question3+'", "'+ req.body.question4+'", "'+ req.body.question5+'", "'+ req.body.description+'", "inTest", 0)'
let query = db.query(sql,function (error, results, next) {
  if (error) throw error;
  
 // console.log(results)
  res.redirect("/activecompetitions")
});




});



router.get('/edit/:content', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'SELECT * FROM sitedata where siteArea = "'+req.params.content+'"' 
    let query = db.query(sql, (err,result) => {
        var stuffLiam = req.cookies.theyLikeCookies
       if(err) throw err;
       res.render('editcontent', {
        user : req.user,result, stuffLiam// get the user out of session and pass to template
    });
       
        
    });


   
});


router.post('/edit/:content', isLoggedIn, isAdmin, function(req, res, next) {
    
    let sql = 'update sitedata set dateDescription = "'+req.body.newContent+'", dataImage = "'+req.body.newImage+'" where siteArea = "'+req.params.content+'"' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       var stuffLiam = req.cookies.theyLikeCookies
       res.render('adminsitedetails',   {
        user : req.user,result , stuffLiam// get the user out of session and pass to template
    });
       
        
    });


});




 // edit comp route
 router.get('/admineditcomp/:clueID', isLoggedIn, function(req, res, next){ 

    var thedude = req.user.userName
    var stuffLiam = req.cookies.theyLikeCookies
    
    let sql = 'SELECT * FROM clue where clueID = '+req.params.clueID+' ;';
        // let sql = 'select  *  from clue where clueID = '+req.params.id+''
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
           
           
           res.render('admineditcomp', {result, stuffLiam})
            
        });
     
    
    
       });
   




       router.post('/editcomp/:clueID', isLoggedIn, isAdmin, function(req, res, next) {
    
        let sql = 'update clue set cName = "'+req.body.clueName+'", cPrize = "'+req.body.cluePrize+'", q1Text = "'+req.body.question1+'", q2Text = "'+req.body.question2+'", q3Text = "'+req.body.question3+'", q4Text = "'+req.body.question4+'", q5Text = "'+req.body.question5+'", cDescription = "'+req.body.description+'" where clueID = "'+req.params.clueID+'"' 
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
           var stuffLiam = req.cookies.theyLikeCookies
           res.render('adminsitedetails',   {
            user : req.user,result , stuffLiam// get the user out of session and pass to template
        });
           
            
        });
    
    
    });





module.exports = router;



