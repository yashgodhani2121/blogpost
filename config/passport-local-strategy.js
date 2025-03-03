const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;

 const Admin= require ("../model/adminmodel");
 const User = require("../model/userModel");
 passport.use('local',new LocalStategy({usernameField:'email',passReqToCallback:true}, async function(req,email,password,done){
  console.log("middelware");
  console.log(email,password);
  const AdminData = await Admin.findOne({email:email});
  if(AdminData){
      if(AdminData.password==password){
          return done(null,{...AdminData,role:'admin'});
      }else{
          req.flash('error',"Invalid Password");
          return done(null,false);
      }
  }else{
      req.flash('error',"Invalid Email");
      return done(null,false);
  }
}));

passport.use('userAuth',new LocalStategy({usernameField:'email',passReqToCallback:true}, async function(req,email,password,done){
  console.log("middelware");
  console.log(email,password);
  const userData = await User.findOne({email:email});
  if(userData){
      if(userData.password==password){
          return done(null,{...userData,role:'user'});
      }else{
          req.flash('error',"Invalid Password");
          return done(null,false);
      }
  }else{
      req.flash('error',"Invalid Email");
      return done(null,false);
  }
}));

passport.serializeUser(function(user,done){
  return done(null,{id:user._doc._id,role:user.role});
})

passport.deserializeUser(async function(data,done){
  if(data.role=='admin'){
      const adminData= await Admin.findById(data.id); 
      if(adminData){
          return done(null,{...adminData,role:data.role});
      }else{
          return done(null,false);
      }
  }else if(data.role=='user'){
      const userData = await User.findById(data.id);
      if(userData){
          return done(null,{...userData,role:data.role});
      }else{
          return done(null,false);
      }
  }else{
      return done(null,false);
  }
});


passport.setAuthuser =async (req,res,next)=>{
  if(req.isAuthenticated()&&req.user.role == 'admin'){
      res.locals.adminData = req.user;
  }else if(req.isAuthenticated()&&req.user.role == 'user'){
      res.locals.userData = req.user;
  }
  next();
}

// passport.checkLoginAdmin = (req,res,next)=>{
//   if(req.isAuthenticated()){
//       next();
//   }else{
//       return res.redirect('/login');
//   }
// }

// module.exports = passport;
// passport.serializeUser (function (user, done) {
//     return done(null, user.id);
// })
// passport.deserializeUser (async function (id, done) {
//     let AdminRecord = await adminmodel.findById(id);
//       if( AdminRecord){
//         return done(null, AdminRecord);
//         }
//         else{
//           let userRecord = await usermodel.findById(id);
//           if( userRecord){
//             return done(null, userRecord);
//             }
//           else{
//               return done(null, false);
//               }
//         }
// })

// passport.setAuthuser= function (req, res, next) {
//   if (req.isAuthenticated()) {
//     res.locals.user = req.user;
//   }
//   next();
// }

passport.checkuser = function (req, res, next) {
   if (req.isAuthenticated()) {
     next();
    }
    else{
      return res.redirect('/adminsignin');
      }
}
module.exports = passport;