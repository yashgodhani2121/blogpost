const Admin=require("../model/adminmodel");
const category=require('../model/categorymodel')
const blog =require('../model/blogsmodel')
const Comment =require('../model/commentesModel')
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
const AesEncryption = require('aes-encryption')
const aes = new AesEncryption()
const {validationResult}= require("express-validator");
const session = require('express-session');
module.exports.dashboard=async(req,res)=>{
    try{
        const Blog=await blog.find();
        const Categorydata=await category.find();
        let datacat= [];
        let labelcat =[];
        Categorydata.map((cat, index) => {
          labelcat.push(cat.categoryname);
          datacat.push(cat.Blogds.length);
          });
           return res.render("Dashboard"
            ,{Blog,Categorydata
              ,datacat,labelcat
            })
           
    }
  
    
    catch(err){
            console.log(err);
            return res.redirect("back");
    }
}
module.exports.addadmin=(req,res)=>{
  try{
           return res.render("addadmin",{
            errordata:[],
            old:[]
           })
}

  catch(err){
          console.log(err);
          return res.render("back");
  }
}
module.exports.viewadmin=async(req,res)=>{
  try{
    
    let admindata=await Admin.find();
    return res.render("viewadmin",{
      admindata
      
})

  }
  catch(err){
          console.log(err);
          return res.render("back");
  }
}
module.exports.insertadmin=async(req,res)=>{
  try{
             const error= validationResult (req);
             console.log(error);
             if(!error.isEmpty()){
              return res.render("addadmin",{errordata: error.mapped(), old:req.body});
              }
        var adminimage="";
        if(req.file) {
          adminimage= Admin.imgPath+"/"+req.file.filename;
          }
          req.body.image=adminimage
          req.body.name=req.body.fname+" "+req.body.lname
          let adminrecord=await Admin.create(req.body);
          if(adminrecord){
             console.log("data added")
             req.flash("success","Admin Added successfully");
             return res.redirect("back");
          }
          else{
            // console.log("data not added")
            req.flash("error","Admin not Added");
            return res.redirect("back");
            }
            
       }
  
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}
module.exports.deleteadmin=async(req,res)=>{
  try{
      let id=req.params.id;
      let getAdmin= await Admin.findById(id);

      if(getAdmin){
      try{
          const deletepath = path.join(__dirname,'..',getAdmin.image);
           await fs.unlinkSync(deletepath);
      }
        catch(err){
          console.log(err)
        }  

      }
       
    let deletedata=await Admin.findByIdAndDelete(id);
    if(deletedata){
      // console.log("Data Deleted");
      req.flash("success","Admin Deleted successfully");
       return res.redirect('back')
    }
    else{
      // console.log("Data Not Deleted");
      req.flash("error","Admin not Deleted");
       return res.redirect('back')
       }
      
  }
  catch(err){
      console.log(err);
      return res.redirect("back")
  }
}
module.exports.updateAdmin = async(req,res)=>{
  try{
    
       let id = req.params.id;
       console.log(id);
       let singleData = await Admin.findById(id);
       
       let flname = singleData.name.split(" ");
       return res.render('editAdmin',{
            flname,
            singleData,
       })
  }
  catch(err){
      console.log(err)
       return res.redirect('back')
  }
}
module.exports.updateAdminRecords = async (req, res) => {
  try {
      let singleData = await Admin.findById(req.body.id);
      if (!singleData) {
          req.flash("error", "Admin not found");
          return res.redirect('back');
      }

      const imagePath = '/upload/admin';

      if (singleData.email === req.body.email) {
          if (req.file) {
              let oldPath = path.join(__dirname, '..', singleData.image);
              try {
                  fs.unlinkSync(oldPath);
              } catch (err) {
                  console.log("Image not found or could not be deleted");
                  req.flash("error", "Image not found or could not be deleted");
                  return res.redirect('back');
              }

              req.body.image = imagePath + "/" + req.file.filename;
          } else {
              req.body.image = singleData.image;
          }

          req.body.name = req.body.fname + " " + req.body.lname;

          await Admin.findByIdAndUpdate(req.body.id, req.body);
          return res.redirect('/viewadmin');
      } else {
          if (req.file) {
              let oldPath = path.join(__dirname, '..', singleData.image);
              try {
                  fs.unlinkSync(oldPath);
              } catch (err) {
                  console.log("Image not found or could not be deleted");
                  req.flash("error", "Image not found or could not be deleted");
                  return res.redirect('back');
              }

              req.body.image = imagePath + "/" + req.file.filename;
          } else {
              req.body.image = singleData.image;
          }

          req.body.name = req.body.fname + " " + req.body.lname;

          await Admin.findByIdAndUpdate(req.body.id, req.body);

          req.flash("success", "Admin updated successfully");
          return res.redirect('/myprofile');
      }
  } catch (err) {
      console.log(err);
      req.flash("error", "Something went wrong");
      return res.redirect('back');
  }
};

module.exports.adminsignin=async(req,res)=>{
  try{
        return res.render('signin');
  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}
module.exports.adminlogin=async(req,res)=>{
  try{
    req.flash( 'success', ' You have logged in successfully');
    return res.redirect('/dashboard');
  }
  catch(err){
    console.log(err);
     return res.redirect("back");
  }
}
module.exports.adminlogout=(req,res)=>{
 try{
  console.log(session);
  
  req.session.destroy((err)=>{
    if(err){
      console.log(err);
    
    }
    req.flash('success','You have logged out successfully');
  return res.redirect('/adminsignin')
   })
  }
   catch(err){
    console.log(err);
    return res.redirect("back");
    }
}

module.exports.myprofile=(req,res)=>{

  try{
      return res.render("myprofile")
  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}

module.exports.changepassword=(req,res)=>{
  try{
    return res.render("changepassword")

    }
        
    catch(err){
        console.log(err);
        return res.redirect("back");
        }
}
module.exports.changenewpassword=async(req,res)=>{
  try{
      console.log ( res.locals.user.password)
       let olddata= res.locals.user
       if( olddata.password=req.body.currentpassword){
           if( req.body.currentpassword != req.body.newpassword){
              if( req.body.newpassword==req.body.confirmpassword){
                let editdata= await Admin.findByIdAndUpdate(olddata.id,{password:req.body.newpassword})
                console.log("passwrod edited succes");
                req.flash('success','Password changed successfully');
                    return res.redirect('/adminlogout')     
           }
           else{
            console.log("password not matched");
            req.flash('error','Password not matched');
            return res.redirect('back')
           }
          }
           else{
            console.log("current password and new password are same");
            req.flash('error','Current password and new password are same');
           }
       }
       else{
           console.log("old password is incorrect")
           req.flash('error','Old password is incorrect')
       }
      
  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}

module.exports.verifyemail=async(req,res)=>{
  try{
      let singleobj= await Admin.find({email:req.body.email}).countDocuments();
      if(singleobj==1){
        let singleAdmindata= await Admin.findOne({email:req.body.email});
        let OTP= Math.floor( Math.random()*1000000);
        
            res.cookie("otp",OTP);
            res.cookie("email",singleAdmindata.email);
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false, // true for port 465, false for other ports
          auth: {
            user: "godhaniy79@gmail.com",
            pass: "xepqactlqfijdvqo",
          },
          tls: {
            rejectUnauthorized: false
            }
           });

           const info = await transporter.sendMail({
            from: 'godhaniy79@gmail.com', // sender address
            to: singleAdmindata.email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>your otp is "+OTP+"</b>", // html body
          });
                console.log("email sent");

               return res.redirect('checkOtp');


      }  
      else{
        console.log("email not found");
         req.flash('error','Email not found')
        return res.redirect("back"); 
      }
  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}

module.exports.checkOtp=(req,res)=>{
  try{
        res.render("checkOtp");

  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}

module.exports.verifyOtp=async (req,res)=>{
  try{
       console.log(req.cookies.otp);
       console.log(req.body.otp);
       if(req.body.otp==req.cookies.otp){
        console.log("otp verified");
        res.clearCookie('otp')
        return res.redirect("forgotpass");
        }

  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}

module.exports.forgotpass= async (req,res)=>{
  try{
      res.render("forgotpass")
  }
  catch(err){
    console.log(err);
    return res.redirect("back");
  }
}
module.exports.verifyPass= async (req,res)=>{
  try{
        if(req.body.newpassword==req.body.confirmpassword){
            let checkLostTime= await Admin.find({ email:req.cookies.email }).countDocuments();
            if(checkLostTime==1){
              let adminnewdata= await Admin.findOne({ email:req.cookies.email});
              let updatepass= await Admin.findByIdAndUpdate({ _id:adminnewdata._id},{ password:req.body.newpassword});
              if( updatepass){
                console.log("password updated");
            
                   res.clearCookie('email')
                   return res.redirect("/");
                   }
                   else{
                    console.log("password not updated");
                    return res.redirect("back");
                   }
            }
            else{

              console.log("email not found");
              return res.redirect("back");
            }
            
        }
        else{
          console.log("new password and conform password not matched");
          return res.redirect("back");
        }
  }
  catch (err){
    console.log(err);
    return res.redirect("back");
    }
}









module.exports.addCategory=(req,res)=>{
    try{
            res.render('addcategory',{
              errordata:[],
            })
    }
    catch(err){
        console.log(err);
        return res.redirect("back")
    }
}

module.exports.insertcategory=async(req,res)=>{
    try{
      const error= validationResult (req);
      console.log(error);
      if(!error.isEmpty()){
       return res.render("addcategory",{errordata: error.mapped(), old:req.body});
       }

        let categorydata=await category.create(req.body)
        if(categorydata){
            console.log("category added")
            req.flash('success','category added')
         return res.redirect('addcategory')
        }
        else{
            console.log("category not added")
            req.flash('error','category not added')
            return res.redirect('back')
        }
    }
    catch(err){
        console.log(err);
        return res.redirect("back")
    }
}
module.exports.viewcategory = async (req, res) => {

try{
    let search='';
    if(req.query.blogSearch){
        search=req.query.blogSearch
        }
    let per_page=1;
    let page=0;
    if(req.query.page){
        page=req.query.page
        }

        let categorydata=await category.find({
            $or:[
                {categoryname:{$regex:search}},
                {categorydate:{$regex:search}},
              
            ]
    }).skip(per_page * page).limit(per_page);
    let totalRecordes=await category.find({
        $or:[
            {categoryname:{$regex:search}},
            {categorydate:{$regex:search}}
        ]
    }).countDocuments();
    let totalPage=Math.ceil(totalRecordes/per_page);
        
        if(categorydata){
            return res.render('viewcategory',
                {categorydata,
                    search,
                    page,
                    totalPage
                }
            )
            }
            else{
                console.log("somthing is wrong")
            }
}
catch(err){
    console.log(err);
    return res.redirect("back")
    }
}

module.exports.updatecategory = async (req, res) => {
  try {
      let id = req.params.id;
      let singledata = await category.findById(id);
      if (singledata) {
          return res.render("updatecategory", {
              singledata
          });
      }
  } catch (err) {
      console.log(err);
      return res.redirect("back");
  }
};

module.exports.editCategory = async (req, res) => {
  try {
      let updatedata = await category.findByIdAndUpdate(req.body.id, req.body);
      if (updatedata) {
          console.log("Data Updated");
          req.flash("success", "Category Updated");
          return res.redirect('viewcategory');
      } else {

          console.log("Data Not Updated");
          req.flash("error","Category Not Updated");
          return res.redirect('back');
      }
  } catch (err) {
      console.log(err);
      return res.redirect("back");
  }
};

module.exports.deleteallcategory=async(req,res)=>{
  try{
    console.log(req.body.Ids);
    let deletedata=await category.deleteMany({_id:{$in:req.body.Ids}});
    if(deletedata){
      console.log("Data Deleted");
      req.flash("success","Category Deleted");
      return res.redirect('back');
      }
      else{
        console.log("Data Not Deleted");
        req.flash("error","Category Not Deleted");
        return res.redirect('back');
      }
      }catch(err){
        console.log(err);
        return res.redirect("back");
        }
}
module.exports.activecategory= async(req,res)=>{
  try{
    console.log( req.query)
    let updatedata=await category.findByIdAndUpdate(req.query.catId,{status:false});
    if(updatedata){
      console.log("Data Updated");
      req.flash("success","Category Deactive");
      return res.redirect('back');
      }
      else{
        console.log("Data Not Updated");
        req.flash("error","Category Not Active");
        return res.redirect('back');
      }
      }catch(err){
        console.log(err);
        return res.redirect("back");
        }
      }
      module.exports.deactivecategory= async(req,res)=>{
        try{
          let updatedata=await category.findByIdAndUpdate(req.query.catId,{status:true});
          if(updatedata){
            console.log("Data Updated");
            req.flash("success","Category Active");
            return res.redirect('back');
            }
            else{
              console.log("Data Not Updated");
              req.flash("error","Category Not Deactive");
              return res.redirect('back');
            }
            }catch(err){
              console.log(err);
              return res.redirect("back");
              }
            }






module.exports.addBlogs=async(req,res)=>{
    try{
        let categorydata=await category.find()
        return res.render('addBlogs',{
            categorydata
        })
    }
    catch(err){
        console.log(err)
        return res.redirect("back")
    }
}

module.exports.insertBlogs=async(req,res)=>{

  var newimage="";
  if(req.file){
      newimage=blog.imgPath+'/'+req.file.filename;
  }
  req.body.blogImage=newimage
let blogdata=  await blog.create(req.body)
if(blogdata){
  let findcategory= await category.findById(req.body.blogCategoryid)
  findcategory.Blogds.push(blogdata._id)
  await category.findByIdAndUpdate( req.body.blogCategoryid, findcategory)
  console.log("Blog Inserted");
  req.flash("success","Blog Inserted");
    return res.redirect('back')
    }else{
      console.log("Blog Not Inserted");
      req.flash("error","Blog Not Inserted");
      return res.redirect('back')
      }

}
module.exports.viewBlogs= async(req,res)=>{
  let search='';
  if(req.query.blogSearch){
      search=req.query.blogSearch
      }
  let per_page=3;
  let page=0;
  if(req.query.page){
      page=req.query.page
      }

 
  let Blogdata=await blog.find({
      $or:[
          {blogTitle:{$regex:search}},
          {blogAuthor:{$regex:search}},
          {blogDescription:{$regex:search}},
      ]
}).skip(per_page * page).limit(per_page).populate("blogCategoryid").exec();
let totalRecordes=await blog.find({
  $or:[
      {blogTitle:{$regex:search}},
      {blogAuthor:{$regex:search}},
      {blogDescription:{$regex:search}},
  ]
}).countDocuments();
let totalPage=Math.ceil(totalRecordes/per_page);


  return res.render("viewBlogs",{
      Blogdata,
      search,
      totalPage,
      page
  })
}
module.exports.deleteBlogs = async (req, res) => {
  try {
    let id = req.params.id;

   
    let getBlog = await blog.findById(id);

    if (getBlog) {
      
      try {
        const deletepath = path.join(__dirname, '..', getBlog.blogImage);
        await fs.unlinkSync(deletepath);
      } catch (err) {
        console.log("Error deleting blog image:", err);
      }

      
      const categoryToUpdate = await category.findById(getBlog.blogCategoryid);

      if (categoryToUpdate) {
        categoryToUpdate.Blogds = categoryToUpdate.Blogds.filter(
          (blogId) => blogId.toString() !== id
        );

     
        await category.findByIdAndUpdate(getBlog.blogCategoryid, categoryToUpdate);
      }
    }

   
    let deletedata = await blog.findByIdAndDelete(id);

    if (deletedata) {
      console.log("Data Deleted");
      req.flash("success", "Blog Deleted Successfully");
      return res.redirect('back');
    } else {
      console.log("Data Not Deleted");
      req.flash("error", "Blog Not Deleted");
      return res.redirect('back');
    }
  } catch (err) {
    console.log("Error deleting blog:", err);
    return res.redirect("back");
  }
};

module.exports.updateBlogs=async(req,res)=>{
  try{
      let id=req.params.id;
      let singledata= await blog.findById(id);
      let categorydata= await category.find();
      if(singledata){
          return res.render("updateBlogs",{
              singledata,
              categorydata
              })
      }
  }
  catch(err){
      console.log(err);
      return res.redirect("back")
  }
}
module.exports.editBlogs=async(req,res)=>{
  try{
      if(req.file){
          let singledata= await blog.findById(req.body.id);
          if(singledata){
              try{
                  const imageOldPath = path.join(__dirname,'..',singledata.blogImage);
                  fs.unlinkSync(imageOldPath);
              }
              catch(err){
                  console.log(err)
                  }
          
          }
          let newImage=blog.imgPath+'/'+req.file.filename;
          req.body.blogImage=newImage
          let updatedata=await blog.findByIdAndUpdate(req.body.id,req.body)
          if(updatedata){
              console.log("Data Updated");
               req.flash("success","Blog Updated");
              return res.redirect('viewBlogs');
              }
         else{
           console.log("Data Not Updated");
             req.flash("error","Blog Not Updated");
           return res.redirect('back')
         }
      }
      else{
          let singledata= await blog.findById(req.body.id);

          if(singledata){
              req.body.blogImage=singledata.blogImage
          }
              let updatedata=await blog.findByIdAndUpdate(req.body.id,req.body)
              if(updatedata){
                  console.log("Data Updated");
                  req.flash("success","Blog Updated");
                  return res.redirect('viewBlogs');

              }
              else{
                  console.log("Data Not Updated");
                  req.flash("error","Blog Not Updated");
                  return res.redirect('back')
              }
      }
    }
  catch(err){
      console.log(err);
      return res.redirect("back")
  }
}


 module.exports.activeblogs= async(req,res)=>{
  try{
    console.log( req.query)
    let updatedata=await blog.findByIdAndUpdate(req.query.BlogsId,{status:false});
    if(updatedata){
      console.log("Data Updated");
        req.flash("success","Blog Deactivated");
      return res.redirect('back');
      }
      else{
        console.log("Data Not Updated");
         req.flash("error","Blog Not Deactivated");
        return res.redirect('back');
      }
      }catch(err){
        console.log(err);
        return res.redirect("back");
        }
      }
      module.exports.deactiveblogs= async(req,res)=>{
        try{
          let updatedata=await blog.findByIdAndUpdate(req.query.BlogsId,{status:true});
          if(updatedata){
            console.log("Data Updated");
            req.flash("success","Blog Activated");
            return res.redirect('back');
            }
            else{
              console.log("Data Not Updated");
              req.flash("error","Blog Not Activated");
              return res.redirect('back');
            }
            }catch(err){
              console.log(err);
              return res.redirect("back");
              }
            }
            module.exports.deleteallBlogs=async(req,res)=>{
              try{
                console.log(req.body.Ids);
                let deletedata=await blog.deleteMany({_id:{$in:req.body.Ids}});
                if(deletedata){
                  console.log("Data Deleted");
                  req.flash("success","Blog Deleted");
                  return res.redirect('back');
                  }
                  else{
                    console.log("Data Not Deleted");
                     req.flash("error","Blog Not Deleted");
                    return res.redirect('back');
                  }
                  }catch(err){
                    console.log(err);
                    return res.redirect("back");
                    }
            }



// Comment code

module.exports.viewcomment = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.render('viewcomment', {
        commentData: comments,
        
      });
  } catch (err) {
    console.log(err);
     return res.redirect("back");
  }
};

module.exports.activecomment= async(req,res)=>{
  try{
    console.log( req.query)
    let updatedata=await Comment.findByIdAndUpdate(req.query.commentid,{status:false});
    if(updatedata){
      console.log("Data Updated");
        req.flash("success","Comment Deactivated");
      return res.redirect('back');
      }
      else{
        console.log("Data Not Updated");
         req.flash("error","Comment Not Deactivated");
        return res.redirect('back');
      }
      }catch(err){
        console.log(err);
        return res.redirect("back");
        }
      }

      module.exports.deactivecomment= async(req,res)=>{
        try{
          let updatedata=await Comment.findByIdAndUpdate(req.query.commentid,{status:true});
          if(updatedata){
            console.log("Data Updated");
            req.flash("success","comment Activated");
            return res.redirect('back');
            }
            else{
              console.log("Data Not Updated");
              req.flash("error","comment Not Activated");
              return res.redirect('back');
            }
            }catch(err){
              console.log(err);
              return res.redirect("back");
              }
            }
