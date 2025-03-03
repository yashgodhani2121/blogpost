const express=require("express");

const port=8000;
const path=require("path")
const cookieParser = require('cookie-parser');
const app= express();
// const db=require("./config/db")

const session = require('express-session');
const passport = require('passport');
const LocalStategy= require("./config/passport-local-strategy");
const flash = require("connect-flash");
const flashMessage= require("./config/flashMessge");
const mongoose=require('mongoose');

 mongoose.connect("mongodb+srv://godhaniy79:yash2122@cluster0.enyby.mongodb.net/adminpanel2").then((res) => {
  console.log("connected to database");
  }).catch((err) => {
    console.log(err,"not connected to database");
    });



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded()); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"assets")));
app.use("/upload",express.static(path.join(__dirname,"upload")));

app.use(session({
  name: 'session',
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*60 }
}));



app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthuser);
app.use(flashMessage.setFlash);
app.use("/",require('./routes/adminroutes'))





app.listen(port,(err)=>{
    if(err) {
           
       console.log(err);
       return false;
     }
     console.log("server start  on port"+port);


})