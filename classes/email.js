'use strict';


const res = require('express/lib/response');
var db = require('../db');
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({

    host: "smtp.reg365.net",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "me@liammccabe.ie", // your domain email address
      pass: "CodL1ver0il" // your password
    },
    tls:{
      rejectUnauthorized: false
    }
  });


module.exports = class Email {
   



   static liamo() {



    let sql = 'select email from users' 
    let query = db.query(sql, (err,result) => {
       if(err) throw err;
       
       result.forEach(function(row) {
           console.log(row.email)

        var mailOptions = {
            from: 'me@liammccabe.ie',
            to: 'me@liammccabe.ie',
            subject: row.email,
            text: 'Can I just check that the email was sent! ' + row.email ,
            html: "<div style='width:100%;background:#a7c7d1'>Welcome to Win.ie</div>"
          };
          
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });



       })
       
        
    });


    
  
    

   }    



   static louise() {



    
    
    var mailOptions = {
      from: 'me@liammccabe.ie',
      to: 'me@liammccabe.ie',
      subject: 'Louise Method',
      text: 'Can I just check that the email was sent!'
    };
    
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    

   }  

  
}




// Gmail

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//   host: 'smtp.gmail.com',
//   auth: {

   
//     user: "seriousliam@gmail.com", // generated ethereal user
//     pass: "cdbvewdgmgbnpclb",
//   }
// });