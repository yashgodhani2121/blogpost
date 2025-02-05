

const mongoose = require('mongoose');



const userSchema = mongoose.Schema({

   email:{
    type:String,
    required:true
   },
   username: {
     type:String,
     required:true
    },
    status:{
        type:Boolean,
        default:true,
        required:true
    },
    password:{
        type:String,
        required:true,
    }
},
{
    timestamps:true
}

);




const user = mongoose.model("user", userSchema);


module.exports = user;
