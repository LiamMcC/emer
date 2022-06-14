var express = require("express"); // This line calls the express module
var app = express(); //invoke express application
var fs = require('fs')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); // Set the template engine (thanks Kevin!)

app.use(express.static('public'));

//Routes
app.use(require('./routes'));  
var db = require('./db');
var crypto = require('crypto');
var Clues = require("./controller/clues.js");
 
app.get('/check',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    res.render('check')
   });


   app.post('/check',  function(req, res, next){  // I have this restricted for admin just for proof of concept
    var whichClue = "clue1"
    var de = req.body.firstClue
    var df = req.body.quess
    console.log("********************** " + de)
    var theStatement = "select " +whichClue+ " from clue where clueID = 3"
    let sql = theStatement
    //'DELETE FROM liammc WHERE Id =  "'+req.params.id+'" ';
    //let sql = ''
    let query = db.query(sql, (req, rows, next) => {
        var d = "hello"
     console.log(theStatement)
     console.log(rows)
     var a = 1
     console.log("=======> " + rows[0].df)

                var hash = crypto.createHash('sha256');
               // var d = req.body.clue1
                console.log("The user entered " + de) // this needs to be taken from a text box by the user
                var data = hash.update(de, 'utf-8');
                var generatedHash = data.digest('hex');
                console.log("Where is my data " + generatedHash)
     
     if (rows[0].clue1 == generatedHash) {
         
        res.send("They Match")
    
     Clues.updateMax(2)
        
    }
     else {res.send("Try Again")}
     
    });
     console.log("Now you are on the checking page!");
   });





app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Time to start winning");
    
  })