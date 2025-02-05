

const mongoose = require('mongoose');

const multer=require('multer');
const path=require('path')
const imagepath="/upload/blog"

const blogSchema = mongoose.Schema({
    blogCategoryid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    }
    ,
    blogTitle:{
        type:String,
        required:true
    }
    ,
    blogDescription:{
        type:String,
        required:true
    }
    ,
    blogImage:{
        type:String,
        required:true
       }
       ,  
    status:{
        type:Boolean,
        default:true,
        required:true
    },
    commentid:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }]
    
},
{
    timestamps:true
}

);



const storageimage=multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '..', imagepath)); 
    },
    
    filename:(req,file,cd)=>{
        cd(null,file.fieldname+'-'+Date.now())
    }
})

blogSchema.statics.uploadImageFile=multer({storage:storageimage}).single('blogImage');
blogSchema.statics.imgPath = imagepath;

const blog = mongoose.model("blog", blogSchema);


module.exports = blog;
