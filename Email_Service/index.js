//import modules installed at the previous step. We need them to run Node.js server and send emails
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();
// create a new Express application instance 
const app = express();

//configure the Express middleware to accept CORS requests and parse request body into JSON
app.use(cors({origin: "*" }));
app.use(bodyParser.json());

var fs = require('fs');

//start application server on port 3000
app.listen(3000, () => {
  console.log("The server started on port 3000");
});


// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, (err, info) => {
    if (err) {
      console.log(err);
      res.status(400);
      res.send({ error: "Failed to send email" });
    } else {
      console.log("Email has been sent");
      res.send(info);
    }
  });
});

const sendMail = (user, callback) => {
    let transporter = nodemailer.createTransport({
      host: process.env.host,
      port: process.env.port,
      secure: false,
      auth: {
        user: process.env.user,
        pass: process.env.pass
      }
    }); 

  //   transporter.use('compile', hbs({
  //     viewEngine: 'express-handlebars',
  //     viewPath: './views/'
  // }));
    

    const mailOptions = {
      from: process.env.email,
      to: user.receiveremail,
      subject: process.env.subject,
      // template: 'index'
      html: `<div>
      <h4 style="border-bottom: 1px solid black">Here is the query with detail of customer.</h4>
      <ul>
        <li><span>Full Name</span><span>&nbsp;  ${user.name}</span></li>
        <li><span>Email Address</span><span>&nbsp;  ${user.senderEmail}</span></li>
        <li><span>Phone Number</span><span>&nbsp;  ${user.phone}</span></li>
        <li><span>Website</span><span>&nbsp;  ${user.website}</span></li>
        <li><span>Message</span><span>&nbsp;  ${user.message}</span></li>
      </ul>
      </div>`
    };
    
    transporter.sendMail(mailOptions, callback);
  }
