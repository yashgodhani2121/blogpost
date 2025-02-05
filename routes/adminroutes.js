const express=require("express");

const router=express.Router();
const Admin=require('../model/adminmodel')
const blog = require('../model/blogsmodel')
const adminctl=require("../controller/admincontroller")
const passport =require("passport");
const {check}= require("express-validator");

console.log("router is conted")
router.get('/adminsignin',adminctl.adminsignin)
router.post("/adminlogin", passport.authenticate('local', { failureRedirect: '/adminsignin' }), adminctl.adminlogin);
router.get("/adminlogout",adminctl.adminlogout);
router.get("/myprofile",adminctl.myprofile);

router.get("/changepassword",adminctl.changepassword);
router.post("/changenewpassword",adminctl.changenewpassword);



router.get("/dashboard",passport.checkuser,adminctl.dashboard);
router.get("/addadmin",passport.checkuser,adminctl.addadmin);
router.get("/viewadmin",passport.checkuser,adminctl.viewadmin);
router.post("/insertadmin",Admin.uploadImageFile,
    check("fname")
    .notEmpty()
    .withMessage("Please enter your name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3 to 20 characters"),

  check("lname")
    .notEmpty()
    .withMessage("Please enter your name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name should be between 3 to 20 characters"),

  check("email").notEmpty().withMessage("Please enter your email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom(async (value) => {
      const user = await Admin.findOne({ email: value });
      if (user) {
        throw new Error("Email already exists");
      }
    }),

    check("password").notEmpty().withMessage("Please enter your password").matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/).withMessage("Password must be between 8 to 15 characters and must contain at least one number , one uppercase letter, one lowercase letter and one special character"),
    check("message").notEmpty().withMessage("Please enter a message"),
    check("gender").notEmpty().withMessage("Please select a valid gender"),
    check("hobby").notEmpty().withMessage("Please select a hobby"),
    check("city").notEmpty().withMessage("Please select a city"),

    adminctl.insertadmin);
router.get("/deleteadmin/:id",adminctl.deleteadmin);
router.get("/updateAdmin/:id",passport.checkuser,adminctl.updateAdmin);
router.post("/updateAdminRecords",Admin.uploadImageFile,adminctl.updateAdminRecords);

 router.get("/checkemail",(req,res)=>{
    return res.render("checkemail")
})
router.post("/verifyemail", adminctl.verifyemail);
router.get("/checkOtp", adminctl.checkOtp);
router.post("/verifyOtp", adminctl.verifyOtp);
router.get("/forgotpass", adminctl.forgotpass);
router.post("/verifyPass", adminctl.verifyPass);




router.get("/addcategory",passport.checkuser,adminctl.addCategory);
router.post("/insertcategory",
   check("categoryname").notEmpty().withMessage("Please enter category name")
  ,adminctl.insertcategory);
router.get("/viewcategory",passport.checkuser,adminctl.viewcategory);
// router.get("/deletecategory/:id",adminctl.deletecategory);
router.get("/updatecategory/:id",adminctl.updatecategory);
router.post("/editCategory",adminctl.editCategory);
router.post("/deleteallcategory",adminctl.deleteallcategory);
router.get("/activecategory",adminctl.activecategory);
router.get("/deactivecategory",adminctl.deactivecategory);

router.get("/addBlogs",passport.checkuser,adminctl.addBlogs);
router.post("/insertBlogs",blog.uploadImageFile,adminctl.insertBlogs);
router.get("/viewBlogs", passport.checkuser,adminctl.viewBlogs);
router.get("/deleteBlogs/:id",adminctl.deleteBlogs);
router.get("/updateBlogs/:id",adminctl.updateBlogs);
router.post("/editBlogs",blog.uploadImageFile,adminctl.editBlogs);
router.post("/deleteallBlogs",adminctl.deleteallBlogs);
router.get("/activeblogs",adminctl.activeblogs);
router.get("/deactiveblogs",adminctl.deactiveblogs);


router.get( "/viewcomment",passport.checkuser,adminctl.viewcomment);
router.get("/activecomment",adminctl.activecomment);
router.get("/deactivecomment",adminctl.deactivecomment);

router.use ("/", require("./userroutes"));
module.exports=router;