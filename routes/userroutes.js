const express = require('express');

const router = express.Router();
const userctl = require("../controller/usercontroller");

const commentModel = require("../model/commentesModel")
const passport = require('passport');

router.get("/userLogin",async (req,res)=>{
    try {
           return res.render("userPanel/userLogin");
    }
    catch(err){
        console.log(err)
        return res.redirect("back")
    }
})
router.get("/userRegister",async (req,res)=>{
    try {
           return res.render("userPanel/userRegister");
    }
    catch(err){
        console.log(err)
        return res.redirect("back")
    }
})
 
 router.post("/checkRegister", userctl.checkRegister)
 router.post("/checkuserlogin",passport.authenticate('userAuth', { failureRedirect: '/userLogin', failureFlash:" Invalid username or password" }),userctl.checkuserlogin)

router.get ('/', userctl.user);

router.get("/singleblog/:id", userctl.singleBlog);

router.post("/createComment",commentModel.uploadImageFile,userctl.createComment);
router.get ("/likebyuser/:commentid", userctl.likebyuser);
router.get ("/dislikebyuser/:commentid", userctl.dislikebyuser);


module.exports = router;