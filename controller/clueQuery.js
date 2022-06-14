var db = require('../db');

'use strict'

/**
 * Module dependencies.
 */



exports.engine = 'hbs';



exports.list = function(req, res, next){

    let sql = 'select clue1 from clue where clueID = 1'
    let query = db.query(sql,function (error, results, next) {
        if (error) throw error;
        
        console.log(results)
        res.send(results);
        //next results 
      });
 
};

