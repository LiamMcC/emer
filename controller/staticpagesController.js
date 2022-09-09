var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');


var Email = require("../classes/email.js");

router.use(require('./userController'))
// Define the home page route
router.get('/', function(req, res) {

    let sql = 'select winners.*, clue.cName from winners JOIN clue ON winners.comp=clue.clueId order by Id DESC ;select * from clue where status = "active" ORDER BY RAND() LIMIT 2;select * from clue where status = "active" ORDER BY clueID DESC LIMIT 3;' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       var title ="Win.ie a brand new type of competitions wesite - treasure hunt online"
       var stuffLiam = req.cookies.theyLikeCookies
       
       res.render('index', {
        user : req.user,result, title, stuffLiam // get the user out of session and pass to template
    });
       
        
    });

    const today = new Date()
    const year = today.getFullYear();
    //console.log(year)

});




router.get('/information/:location', function(req, res, next) {
    
    let sql = 'SELECT * FROM sitedata where siteArea = "'+req.params.location+'"' 
    let query = db.query(sql, (err,result) => {
        var stuffLiam = req.cookies.theyLikeCookies
       if(err) throw err;
       var title = "Win.ie: " + result[0].dataTitle + " competitions for members"
       res.render('sitecontent', {
        user : req.user,result, stuffLiam, title // get the user out of session and pass to template
    });
       
        
    });
    
   // res.render('adminsitedetails')

});


router.get('/mail', function(req, res, next) {
    

    Email.liamo()
    //Email.louise()
    res.send('Your Good')
});


router.post('/contact', function(req, res, next) {
   


    if (req.body.verifyBox == "Dublin" || req.body.verifyBox == "dublin" || req.body.verifyBox == "DUBLIN" ) {

    Email.louise(req.body.email, req.body.comment, req.body.verifyBox)
    res.redirect('/thankyou')
    } else {

        res.redirect('/wrongcaptcha')
    }

    
});

router.get('/thankyou', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('thankyou', {stuffLiam})
});

router.get('/wrongcaptcha', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('wrongcaptcha', {stuffLiam})
});



router.post('/subscribe', function(req, res, next) {
    let sql = 'insert into newsletter  (emailAddress) values ("'+req.body.useremail+'")';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
     
        
    });
    res.redirect("/subscribed")
});


router.get('/subscribed', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('subscribed', {stuffLiam})
});

router.get('/unsubscribe', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('unsubscribe', {stuffLiam})
});

router.post('/unsubscribe', function(req, res, next) {
    let sql = 'delete from newsletter where emailAddress = "'+req.body.useremail+'"';
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
     
        
    });
    res.redirect("/unsubscribed")
});


router.get('/unsubscribed', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('unsubscribed', {stuffLiam})
});

module.exports = router;



