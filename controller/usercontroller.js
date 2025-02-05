const category= require("../model/categorymodel")
const blog = require("../model/blogsmodel")
const Comment= require ("../model/commentesModel")
const user = require("../model/userModel");
module.exports.user = async (req, res) => {
  try {
    let search = '';
    if (req.query.blogSearch) {
      search = req.query.blogSearch.trim();
    }

    let per_page = 6;
    let page = 0;
    if (req.query.page) {
      page = parseInt(req.query.page);
    }

    if (req.query.catid) {
      let blogdata = await blog
        .find({
          $or: [
            { blogTitle: { $regex: search  } },
          ],
          status: true,
          blogCategoryid: req.query.catid,
        })
        .skip(per_page * page)
        .limit(per_page)
        .populate("blogCategoryid")
        .exec();

      let totalRecords = await blog
        .find({
          $or: [
            { blogTitle: { $regex: search } },
          ],
          status: true,
          blogCategoryid: req.query.catid,
        })
        .countDocuments();

      let totalPage = Math.ceil(totalRecords / per_page);
      const categorydata = await category.find({ status: true });

      return res.render("userPanel/home", {
        blogdata,
        categorydata,
        search,
        totalPage,
        page,
      });
    } else {
      let blogdata = await blog
        .find({
          $or: [
            { blogTitle: { $regex: search } },
          ],
          status: true,
        })
        .skip(per_page * page)
        .limit(per_page)
        .populate("blogCategoryid")
        .exec();

      let totalRecords = await blog
        .find({
          $or: [
            { blogTitle: { $regex: search } },
          ],
          status: true,
        })
        .countDocuments();

      let totalPage = Math.ceil(totalRecords / per_page);
      const categorydata = await category.find({ status: true });

      return res.render("userPanel/home", {
        blogdata,
        categorydata,
        search,
        totalPage,
        page,
      });
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};


  
module.exports.singleBlog = async (req, res) => {
  try {
    const search = ""; 
    const postid = req.params.id; 
    const commentList = await Comment.find({ postid: req.params.id, status: true });
   
    const blogData = await blog
      .findById(postid)
      .populate("blogCategoryid")
      .exec();

   
    const blogList = await blog
      .find()
      .sort({ createdAt: -1 }) 
      .limit(5)
      .exec();

    return res.render("userPanel/singleblog", {
      blogData,
      blogList, 
      search,
      postid,
      commentList
    });
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};

 module.exports.createComment = async (req, res) => {
  try {
     console.log(req.body);
     console.log(req.file) ;    
     var Commentimage="";
     if(req.file) {
      Commentimage= Comment.imgPath+"/"+req.file.filename;
       }
       req.body.image=Commentimage
       
       let Commentrecord=await Comment.create(req.body);
       if(Commentrecord){
        let findComment= await blog.findById(req.body.postid)
        findComment.commentid.push(Commentrecord._id)
        await blog.findByIdAndUpdate( req.body.postid, findComment)

          return res.redirect("back");
       }
       else{
         return res.redirect("back");
         }
         

  }
   catch (err) {
    console.log(err);
    return res.redirect("back");
    }
    };
  
module.exports.checkRegister= async (req, res) => {
  try {
      if(req.body.password==req.body.cpassword){
            const userdata= await user.create(req.body);
            if(userdata){
               console.log("user created");
               return res.redirect("/");
            }
            else{
              console.log("something is wrong")
              return res.redirect("back");
            }
      }
      else{
         console.log(" password and confirm password not match");
           return res.redirect("back")
      }

  }
  catch(err){

  }
}
module.exports.checkuserlogin=async(req,res)=>{
  try{
    req.flash( 'success', ' You have logged in successfully');
    return res.redirect('/');
  }
  catch(err){
    console.log(err);
     return res.redirect("back");
  }
}
module.exports.likebyuser = async (req, res) => {
  try {
    console.log(req.params.commentid);
    let singelcomment = await Comment.findById(req.params.commentid);

    if (singelcomment) {
      console.log(singelcomment);
      
      let userlikealredyexist = await singelcomment.like.includes(req.user._id);
      
      if (userlikealredyexist) {
        let newdata = singelcomment.like.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singelcomment.like = newdata;
      } else {
        singelcomment.like.push(req.user._id);

        let newdislikedata = singelcomment.dislike.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singelcomment.dislike = newdislikedata;
      }

      await Comment.findByIdAndUpdate(req.params.commentid, singelcomment);
      return res.redirect("back");
    } else {
      console.log("comment is not found");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};


module.exports.dislikebyuser = async (req, res) => {
  try {
    console.log(req.params.commentid);
    let singelcomment = await Comment.findById(req.params.commentid);

    if (singelcomment) {
      console.log(singelcomment);
      
      let userdislikealredyexist = await singelcomment.dislike.includes(req.user._id);
      
      if (userdislikealredyexist) {
        let newdata = singelcomment.dislike.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singelcomment.dislike = newdata;
      } else {
        singelcomment.dislike.push(req.user._id);

       
        let newlikedata = singelcomment.like.filter((v, i) => {
          if (!v.equals(req.user._id)) {
            return v;
          }
        });
        singelcomment.like = newlikedata;
      }

      await Comment.findByIdAndUpdate(req.params.commentid, singelcomment);
      return res.redirect("back");
    } else {
      console.log("comment is not found");
      return res.redirect("back");
    }
  } catch (err) {
    console.log(err);
    return res.redirect("back");
  }
};
