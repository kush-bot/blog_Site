import mongoose from "mongoose";
import bcrypt from 'bcrypt';

let Schema = mongoose.Schema;

const UserSchema = new Schema({
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
        select:false,
        required:true
    }


},{timestamps:true});


UserSchema.statics.signup= async function(email,password,username){
    const exist = await this.findOne({email});

    if(exist){
        throw Error("user alreday exist");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password,salt);

    const createdUser = await this.create({email,password:hash,username})
    const user = await this.findById(createdUser._id).select('-password');


    return user;
}



export default mongoose.model('User',UserSchema);


