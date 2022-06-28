var express = require("express"); // This line calls the express module
var app = express(); 
const res = require("express/lib/response");
var db = require('../db');
'use strict';

module.exports = class User {
   

            static newPersonDefaults(theWho, theMail){

                var datetime = new Date();
                console.log(datetime);
                           // 'select * FROM clue where status = "active" and clueID = '+req.params.id+''
                let sql = 'INSERT INTO userSubs (userName, email, subValue) values ("'+theWho+'", "'+theMail+'", 0)';
                let xxx = db.query(sql);
                   
                }

       
 
  
}

