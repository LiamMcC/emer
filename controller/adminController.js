var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var db = require('../db');

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



module.exports = router;



