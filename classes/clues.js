var express = require("express"); // This line calls the express module
var app = express(); 
const bcrypt = require("bcrypt");
var crypto = require('crypto');
const res = require("express/lib/response");
var db = require('../db');
const { nextTick } = require("process");
'use strict';

module.exports = class Clue {
   
// ****** v2 from here ******
    static updateMax(x,y){
var newMax = x
console.log("The id is " + y)
        let sql = 'UPDATE clue SET currentMax =  ' +newMax+'  where clueID = '+y+'';
    console.log("***** Y is " + y + " New max is " + newMax)
        let query = db.query(sql, (err,res) => {
            
            if(err) throw err;
            
            
            
        });
       

    }


    static updateStatus(x,y){
        var newMax = "Solved"
        console.log("The id is " + y)
                let sql = 'UPDATE clue SET status =  "Solved"  where clueID = '+y+'';
            
                let query = db.query(sql, (err,res) => {
                    
                    if(err) throw err;
                    console.log("Updated")
                    
                    
                });
               
        
            }




            static weHaveAWinner(comp, winner){

                var datetime = new Date();
                console.log(datetime);
                           // 'select * FROM clue where status = "active" and clueID = '+req.params.id+''
                let sql = 'INSERT INTO winners (comp, userName) values ('+comp+', "'+winner+'")';
                let xxx = db.query(sql);
                   
                }

                static newUserLevel(usNm, cmp, progs){

                    
                    
                               // 'select * FROM clue where status = "active" and clueID = '+req.params.id+''
                    let sql = 'INSERT INTO userComps (userName, comp, currentProgress ) values ("'+usNm+'", "'+cmp+'", "'+progs+'")';
                    let xxx = db.query(sql);
                       
                    }

                    static updateUserLevel(usNm, cmp, progs){

                    
                    
                        // 'select * FROM clue where status = "active" and clueID = '+req.params.id+''
             let sql = 'update userComps set currentProgress = "'+progs+'" where comp = "'+cmp+'" and userName = "'+progs+'"';
             let xxx = db.query(sql);
                
             }


// ****** v2 end here ******













   static hashClue1() {
     
    
    var hash = crypto.createHash('sha256');
    var data = hash.update('hello', 'utf-8');
//Creating the hash in the required format
   var generatedHash = data.digest('hex');
//Printing the output on the console
console.log("hash : " + generatedHash);
    
    



      let original = 'generic'
      
      console.log(generatedHash)
      return { original, generatedHash };
   }    


  

 
      

    static getMultiple (){

            return this.theSql()
      

    
    //   /return x
        
        
        
      }
      
      
      static theSql (req, rows) {
         
        let sql = 'select clue1 from clue where clueID = 1'
        let query = db.query(sql,function (error, results, next) {
            if (error) throw error;
            
           
            res.render("test", {results})
          });
       // console.log("******************** " + results)
       
        
    }
     

    static finally() {


        let sql = 'select Clue1 from clue where clueID = 1'
        let query = db.query(sql, (req, rows, next) => {
            this.iii(rows)
          ttt(rows)
         console.log(rows)
         //res.send(rows)
        });
    
         function ttt(x,next){
            console.log("*************** " + JSON.stringify(x))
            var y = JSON.stringify(x)
            next
        }
        
        //console.log("%%%%%%%%%%%%%%%%%%% " + JSON.stringify(y))
   //return  "y"
    }

    static iii(d){
        console.log("Im d " + JSON.stringify(d))
return JSON.stringify(d)
    }



    static liamo() {


        let sql = 'select clue1 from clue where clueID = 1'
        var query = db.query(sql, (req, rows, next) => {
          var y = JSON.stringify(rows[0].clue1)
         console.log(y)
        return query
        });
//console.log ("Balls " + query)
    }


 
 
  
}

