
const mongoose = require('mongoose');

const multer = require('multer');
const path=require('path')
const imagepath="/upload/admin"

const adminschema = mongoose.Schema({
     
    name: {
        type: String,
        required: true
    }
    ,
    email: {
        type: String,
        required: true
        },
     password: {
        type: String,
        required: true
        },
    message:{
        type:String,
        required:true
    },
     gender:{
        type:String,
        required:true
     },
     hobby:{
        type:Array,
        required:true
     },
     city:{
        type:String,
        required:true
     },
   
    image:{
            type:String,
            required: true
    },
},{
    timestamps: true
})

const storageimage=multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, path.join(__dirname, '..', imagepath)); 
    },
    
    filename:(req,file,cd)=>{
        cd(null,file.fieldname+'-'+Date.now())
    }
})

adminschema.statics.uploadImageFile=multer({storage:storageimage}).single('image');
adminschema.statics.imgPath = imagepath;

const Admin = mongoose.model('Admin', adminschema);
module.exports = Admin;