var express = require("express"); // This line calls the express module
var app = express(); 
const bcrypt = require("bcrypt");
var crypto = require('crypto');
const res = require("express/lib/response");
var db = require('../db');
const { nextTick } = require("process");
'use strict';

module.exports = class Clue {
   

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


  

   static people(){



    let sql = 'select * from clue where clueID = 1';
    let xxx = db.query(sql);
    console.log(xxx)
    return xxx
    

    
    }
      

    static getMultiple (){

            return this.theSql()
      

    
    //   /return x
        
        
        
      }
      
      
      static theSql (req, rows) {
         
        let sql = 'select clue1 from clue where clueID = 1'
        let query = db.query(sql,function (error, results, next) {
            if (error) throw error;
            
            console.log(results)
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
        let query = db.query(sql, (req, rows, next) => {
          var y = JSON.stringify(rows[0].clue1)
         console.log("Here " + JSON.stringify(rows[0].clue1))
         return y 
        });
return "y"
    }



    static updateMax(x){

        let sql = 'UPDATE clue SET status = "active" ';
    
        let query = db.query(sql, (err,res) => {
            
            if(err) throw err;
            
            console.log(res);
            
        });
       

    }
 
  
}

