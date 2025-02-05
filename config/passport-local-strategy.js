const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

 const adminmodel= require ("../model/adminmodel");
 const usermodel = require("../model/userModel");

passport.use (new LocalStrategy({ 
    usernameField: 'email' },
    async function  (email, password, done) {
         console.log(email , password );
        let Admindata = await adminmodel.findOne({ email: email });
      if (Admindata) {
        if (Admindata.password== password ){
            return done(null, Admindata);
        }
         else{
            return done(null, false);
         }
      }
      else {
        return done(null, false);
      }
}))

passport.use ("userAuth",new LocalStrategy({ 
  usernameField: 'email' },
  async function  (email, password, done) {
       console.log(email , password );
      let Admindata = await usermodel.findOne({ email: email });
    if (Admindata) {
      if (Admindata.password== password ){
          return done(null, Admindata);
      }
       else{
          return done(null, false);
       }
    }
    else {
      return done(null, false);
    }
}))

passport.serializeUser (function (user, done) {
    return done(null, user.id);
})
passport.deserializeUser (async function (id, done) {
    let AdminRecord = await adminmodel.findById(id);
      if( AdminRecord){
        return done(null, AdminRecord);
        }
        else{
          let userRecord = await usermodel.findById(id);
          if( userRecord){
            return done(null, userRecord);
            }
          else{
              return done(null, false);
              }
        }
})

passport.setAuthuser= function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
}

passport.checkuser = function (req, res, next) {
   if (req.isAuthenticated()) {
     next();
    }
    else{
      return res.redirect('/adminsignin');
      }
}
module.exports = passport;