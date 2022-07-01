var express = require("express"); // This line calls the express module
var app = express(); 
const res = require("express/lib/response");
var db = require('../db');
'use strict';

module.exports = class User {
   

            static newPersonDefaults(theWho, theMail){
              const today = new Date();
              const year = today.getFullYear();
                var datetime = new Date();

                console.log(datetime);
                           // 'select * FROM clue where status = "active" and clueID = '+req.params.id+''
                let sql = 'INSERT INTO userSubs (userName, email, subValue) values ("'+theWho+'", "'+theMail+'", 0)';
                let xxx = db.query(sql);

                let sql2 = 'INSERT INTO userConcent (username, agreed, DOBday, DOBmonth, DOByear) values ("'+theWho+'", false, 1,1, "'+year+'")';
                let xxx2 = db.query(sql2);
                   
                }



                static newCompDefaults (theWho) {


                    let sql = 'select * FROM clue';
                    let query = db.query(sql, (err,result) => {
                       if(err) throw err;
                       result.forEach(function(row) {
                        let sql = 'INSERT INTO userComps (userName, comp, currentProgress) values ("'+theWho+'", '+row.clueID+', 0)';
                        let xxx = db.query(sql);
                        console.log(row.clueID);
                      });
                       
                        
                    });


                }

       
 
  
}

