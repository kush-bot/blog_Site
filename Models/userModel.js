import mongoose from "mongoose";

let Schema = mongoose.Schema;

const User = new Schema({
    username:{
        type:String,
        required:true,
        unique:true 
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        minlength:[6,'password should be minimum of 6 characters'],
        select:false
    }


},{timestamps:true});

module.exports = mongoose.model('User',User);


