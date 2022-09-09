var express = require('express');

var router = express.Router();
var bodyParser = require("body-parser") // call body parser module and make use of it
router.use(bodyParser.urlencoded({extended:true}));
var flash    = require('connect-flash');
var passport = require('passport');
var db = require('../db');
var Email = require("../classes/email.js");

var LocalStrategy = require('passport-local').Strategy;
var localStorage = require('node-localstorage')
var session  = require('express-session');
var cookieParser = require('cookie-parser');

// Create a table called users with autoincrement id username and password fields as a mnimum
const stripe = require('stripe')(process.env.STRIPE_KEY);

var bcrypt = require('bcrypt-nodejs');

router.use(cookieParser('qwerty')); // read cookies (needed for auth)

var aUser = require("../classes/user.js");
const { append } = require('express/lib/response');

// required for passport
router.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
    // cookie: { maxAge: 1000 * 60 * 3 } // Set this so that sessions time out after whatever time I need
 } )); // session secret
 router.use(passport.initialize());
 router.use(passport.session()); // persistent login sessions
 router.use(flash()); // use connect-flash for flash messages stored in session

 router.use(function (req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });


  
// --------------------------------------------------------- Authenthication ------------------------------------------------------------ //

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	router.get('/login', function(req, res) {
        var stuffLiam = req.cookies.theyLikeCookies
		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage'),stuffLiam });
	});

	// process the login form
	router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            

            if (req.body.remember) {
                //  maxAge: 1000 * 60 * 1
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	router.get('/signup', function(req, res) {
        var stuffLiam = req.cookies.theyLikeCookies
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage'),stuffLiam });
	});

	// process the signup form
	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	router.get('/profile', isLoggedIn, function(req, res) {
        
        let sql = 'select DISTINCT userName FROM winners LIMIT 3; select * from clue order by clueId DESC Limit 1;SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where clue.status= "active" and userComps.username = "'+req.user.userName+'" order by comp DESC limit 1;SELECT * FROM clue left JOIN userComps ON clue.clueId=userComps.comp where userComps.username = "'+req.user.userName+'" order by comp DESC;;' 
        let query = db.query(sql, (err,result) => {
            var stuffLiam = req.cookies.theyLikeCookies
           
           if(err) throw err;
           res.render('profile', {
            user : req.user,result,stuffLiam // get the user out of session and pass to template
        });
       
            
        });


		
	});


   
	

    router.get('/logout', function(req, res, next) {
        req.logout(function(err) {
          if (err) { return next(err); }
          res.redirect('/');
        });
      });


      router.get('/paymentdetails',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
       
        
    
        let sql = 'SELECT * FROM userConcent where userName = "'+req.user.userName+'"' 
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
           var stuffLiam = req.cookies.theyLikeCookies
//            const mins = 1000 * 60;
//            const hrs = mins * 60;
//            const days = hrs * 24;
//            const years = days * 365;

//            var day = result[0].DOBday
//            var month = result[0].DOBmonth
//            var year = result[0].DOByear
//            var fulldob = year + "-" + month + "-" + day 
//            var today = new Date()
//            var xxx = new Date (fulldob)
//            var diffdate = today - xxx

//            var dfghj = today - xxx
// let isItSo = Math.round(dfghj / years);
          
        
            if (result[0].agreed && result[0].overAge == true) {
                let sql = 'select * from userSubs where userName = "'+req.user.userName+'" ORDER BY Id DESC;' 
                let query = db.query(sql, (err,result) => {
                   if(err) throw err;
                   key = "pk_test_51LGfbwDr1wDNKAxevr4DB4WCNOItXjPbJgjrS4MZxuwCqxiAntBh4V97vjWfUqq3SN6gFzrVdllwZ3mzDRzImXYl00YBLoxZ6i"
                   res.render('paymentdetails', {user : req.user, result, key,stuffLiam})
                    
                });
            
            } 
            
            else if(result[0].agreed && result[0].overAge == false){

                let sql = 'select * from userConcent where userName = "'+req.user.userName+'";' 
                let query = db.query(sql, (err,result) => {
                   if(err) throw err;
                   
                   res.render('youaretooyoung', {user : req.user, result,stuffLiam})
                   
                    
                });
                console.log("They agreed but are too young" )
            
            }

            else if(!result[0].agreed && result[0].overAge == true){

                let sql = 'select * from userConcent where userName = "'+req.user.userName+'";' 
                let query = db.query(sql, (err,result) => {
                   if(err) throw err;
                   
                   res.render('youmustagree', {user : req.user, result})
                   
                    
                });
                console.log("They agreed but are too young" )
            
            }
        
            else {
                res.render('concentneeded', {user : req.user,stuffLiam})
                console.log("they need to provide date of birth and agree")
            }
           
            
        });
    
    


     
    
       });


       router.post('/consentgiven',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
        //let sql = 'select * FROM clue where status = "active"; '
        const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let checkedValue = req.body['checkedConsent']
        if (checkedValue == "on"){
            let sql = 'update userConcent set agreed = true, dateAgreed = "'+today+'" where userName = "'+req.user.userName+'";' 
            let query = db.query(sql, (err,result) => {
               if(err) throw err;
                res.redirect('/profile')
                
            });
            
        
        } else {

            res.redirect('/profile')
        }
        
  
    
       });


       router.post('/consentanddob',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
        //let sql = 'select * FROM clue where status = "active"; '
        const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
        let checkedAgeValue = req.body['checkedTheAge']
        let checkedValue = req.body['checkedConsent']
        if (checkedValue == "on" && checkedAgeValue != "on"){
            let sql = 'update userConcent set agreed = true, dateAgreed = "'+today+'" where userName = "'+req.user.userName+'";' 
            let query = db.query(sql, (err,result) => {
               if(err) throw err;
                res.redirect('/profile')
                
            });
            
        
        } else if  (checkedValue == "on" && checkedAgeValue == "on"){
            const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
           // const today = new Date();
            let sql = 'update userConcent set agreed = true,overAge = true, dateAgreed = "'+today+'" where userName = "'+req.user.userName+'";' 
            let query = db.query(sql, (err,result) => {
               if(err) throw err;
                res.redirect('/profile')
                
            });
        }
        
        else if  (checkedValue != "on" && checkedAgeValue == "on"){
            const today = new Date().toISOString().slice(0, 19).replace('T', ' ');
           // const today = new Date();
            let sql = 'update userConcent set overAge = true, dateAgreed = "'+today+'" where userName = "'+req.user.userName+'";' 
            let query = db.query(sql, (err,result) => {
               if(err) throw err;
                res.redirect('/profile')
                
            });
        }


        else {

            res.redirect('/profile')
        }
  
    
       });

    
       router.get('/checkout', function(req, res, next) {
       
    
        
        res.render('checkout')
    });

    router.post('/create-checkout-session', async (req, res) => {
        var PRICE_ID = 30
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        tax_behavior: "inclusive",
                        product_data: {
                            name: "Sub for Win"
                        },
                        unit_amount: 3000,
                    },
                    quantity: 1,
                },
            ],
          mode: 'payment',
          success_url: 'http://localhost:3000/kjsdkafkahfkhkrhjhskhdhshdkshdsasuccesskdksgdkgsdkgdkdkskasdggsadkgd',
          cancel_url: 'http://localhost:3000/cancel',
          automatic_tax: {enabled: true},
        });
      
        res.redirect(303, session.url);
      });

      router.get('/kjsdkafkahfkhkrhjhskhdhshdkshdsasuccesskdksgdkgsdkgdkdkskasdggsadkgd',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
          //let sql = 'select * FROM clue where status = "active"; ' 
          let sql = 'insert into userSubs (userName, email, subValue, validSub) values ("'+req.user.userName+'", "'+req.user.email+'", 30, true);' 
          let query = db.query(sql, (err,result) => {
             if(err) throw err;
              res.redirect('/profile')
              
          });
    
       });

       router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
        const payload = request.body;
      
       
      
        response.status(200);
      });


      router.get('/paysubscription',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
        
        
        //let sql = 'select * FROM clue where status = "active"; ' 
        let sql = 'insert into userSubs (userName, email, subValue, validSub) values ("'+req.user.userName+'", "'+req.user.email+'", 20, true);' 
        let query = db.query(sql, (err,result) => {
           if(err) throw err;
            res.redirect('/profile')
            
        });
    
       });


// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}


// see are they admin
function isAdmin(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.user.admin)
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}




//module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here
    });

    // used to deserialize the 
    passport.deserializeUser(function(Id, done) {    // LOCAL SIGNUP ============================================================

       db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
            done(err, rows[0]);
        });
    });

    // =========================================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

  passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
                if (err)
                    return done(err);
                if (rows.length) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // if there is no user with that username
                    // create the user
                    var newUserMysql = {
                        username: username,
                        email: req.body.email,
                        password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                    };

                    var insertQuery = "INSERT INTO users ( username, email, password ) values (?,?,?)";
                    aUser.newPersonDefaults(username, req.body.email)
                    aUser.newCompDefaults(username)
                    db.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                        newUserMysql.Id = rows.insertId;

                        return done(null, newUserMysql);
                    });
                }
            });
        })
    );

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
//};


router.get('/testauto', function(req, res) {



 let options = {
     maxAge: 1000 * 60 * 1 // would expire after 1 minutes
     //httpOnly: true, // The cookie only accessible by the web server
    // signed: true // Indicates if the cookie should be signed
 }

 res.cookie('theyLikeCookies', '1', options) // options is optional
 //res.send('')
 console.log('Cookies: ', req.cookies.theyLikeCookies);
 req.session.save(); // This saves the modifications

// ****************** THe Following will get rid of cookie 
// app.get('/removeCookies',function(req, res){
//     res.clearCookie('cookie1');
//     res.send("Cookie has been cleared");
// });


// ****************** THe above will get rid of cookie 


    

});




router.get('/acceptCookie', function(req, res) {



    let options = {
        maxAge: 1000 * 60 * 90 // would expire after 90 minutes
        //httpOnly: true, // The cookie only accessible by the web server
      // signed: true // Indicates if the cookie should be signed
    }
   
    res.cookie('theyLikeCookies', '1', options) // options is optional
    //res.send('')
  

   
    res.redirect(req.get('referer'));
   //res.redirect('/');
   });



   router.get('/cancelCookie', function(req, res) {



    let options = {
        maxAge: 1000 * 60 * 90 // would expire after 90 minutes
        //httpOnly: true, // The cookie only accessible by the web server
      // signed: true // Indicates if the cookie should be signed
    }
   
    res.cookie('theyLikeCookies', '0', options) // options is optional
    //res.send('')
   

   
   // res.redirect(req.get('referer'));
   res.redirect('/');
   });









router.get('/deleteaccountconfirm',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 
    var updateAccPass = bcrypt.hashSync("req.body.newpassword", null, null)  // use the generateHash function in our user model
    let sql = 'update users set password = "'+updateAccPass+'" where userName = "'+req.user.userName+'";'  
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.redirect('/logout')
        
    });

   });



   router.post('/startresetpassword',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    //to do this take a random generator and generate a random 10 digit password
    // set the password to the new password for the account
    // email the password to the user ; ' 
    // Put in a condition that this cant be done if the account was ever deleted
    // tell the user to email the site if there is an issue with this
    // var updateAccPass = bcrypt.hashSync("req.body.newpassword", null, null)  // use the generateHash function in our user model
    // let sql = 'update users set password = "'+updateAccPass+'" where userName = "'+req.user.userName+'";'  
    // let query = db.query(sql, (err,result) => {
    //    if(err) throw err;
    //     res.redirect('/logout')
        
    // });

    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * 
     charactersLength));
       }
       return result;
    }
    
    var randomPassword = makeid(8)
 


    // the function to update the password
    var deletedAcc = bcrypt.hashSync(randomPassword, null, null)  // use the generateHash function in our user model
    let sql = 'update users set password = "'+deletedAcc+'" where email = "'+req.body.resetEmail+'";'  
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.redirect('/')
        
    });

    // the function to update the password

    Email.rmaiReset(req.body.resetEmail, randomPassword)

   });


   router.get('/resetpassword', function(req, res, next) {
    var stuffLiam = req.cookies.theyLikeCookies
    res.render('resetpassword', {stuffLiam})
});


   router.get('/editprofile', isLoggedIn, function(req, res) {
        

    var stuffLiam = req.cookies.theyLikeCookies
    res.render('editprofile', {
        user : req.user, stuffLiam // get the user out of session and pass to template
    });
    
});


router.post('/changepassword',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 
    var deletedAcc = bcrypt.hashSync(req.body.newpassword, null, null)  // use the generateHash function in our user model
    let sql = 'update users set password = "'+deletedAcc+'" where userName = "'+req.user.userName+'";'  
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.redirect('/logout')
        
    });

   });


   router.post('/changeemail',isLoggedIn,  function(req, res, next){  // I have this restricted for admin just for proof of concept
    //let sql = 'select * FROM clue where status = "active"; ' 
      // use the generateHash function in our user model
    let sql = 'update users set email = "'+req.body.newemail+'" where userName = "'+req.user.userName+'";'  
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
        res.redirect('/logout')
        
    });

   });

module.exports = router;