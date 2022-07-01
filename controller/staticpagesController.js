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
       var title ="Hi Liam"
       res.render('index', {
        user : req.user,result, title // get the user out of session and pass to template
    });
       
        
    });

    const today = new Date()
    const year = today.getFullYear();
    console.log(year)

});




router.get('/information/:location', function(req, res, next) {
    
    let sql = 'SELECT * FROM sitedata where siteArea = "'+req.params.location+'"' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       res.render('sitecontent', {
        user : req.user,result // get the user out of session and pass to template
    });
       
        
    });
    
   // res.render('adminsitedetails')

});


router.get('/mail', function(req, res, next) {
    console.log('It Looks like the mail sent');

    Email.liamo()
    //Email.louise()
    res.send('Your Good')
});



module.exports = router;



