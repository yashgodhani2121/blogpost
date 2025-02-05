

const mongoose = require('mongoose');



const categorySchema = mongoose.Schema({
    categoryname:{
        type:String,
        required:true
    }
    ,
    status:{
        type:Boolean,
        required:true,
        default:true
    },
    Blogds:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'blog'
    }]
    
},
{
    timestamps:true
    });




const category = mongoose.model("category", categorySchema);


module.exports =category;
