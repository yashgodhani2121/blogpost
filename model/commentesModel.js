

const mongoose = require('mongoose');

const multer=require('multer');
const path=require('path')
const imagepath="/upload/user"

const commentesSchema = mongoose.Schema({
  postid:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"blog",
         required:true
  },
   email:{
    type:String,
    required:true
   },
   userName: {
     type:String,
     required:true
    },
   image: {
      type: String,
      required: true
    },
    status:{
        type:Boolean,
        default:true,
        required:true
    }  ,
    comment:{
        type:String,
        required:true,
    },
    like:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
            }
    ],
    dislike:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
            }
     ],
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

commentesSchema.statics.uploadImageFile=multer({storage:storageimage}).single('image');
commentesSchema.statics.imgPath = imagepath;

const Comment = mongoose.model("Comment", commentesSchema);


module.exports = Comment;
