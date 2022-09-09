var express = require("express"); // This line calls the express module
var app = express(); //invoke express application
var fs = require('fs')
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs'); // Set the template engine (thanks Kevin!)

app.use(express.static('public'));
app.use(express.static("images")); // Allow access to images
//Routes
app.use(require('./routes'));  




var db = require('./db');
var crypto = require('crypto');
var Clues = require("./classes/clues.js");
 
//catch all endpoint will be Error Page
app.get("*", function(req,res){
  var stuffLiam = req.cookies.theyLikeCookies
  res.render('oops', {stuffLiam});
});
    
      // custom error handling if it is 404 render 404 page
app.use((req, res, next) => {
  const err = new Error(res.render('oops'))
  err.status = 404
  //res.render('oops');
  next(err) 
});

app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
    console.log("Time to start winning");
    
  })