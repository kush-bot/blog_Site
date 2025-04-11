import mongoose from "mongoose";

export const connectDb=async()=>{
    try{
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log("db connection established succesfully")
    }catch(err){
        console.error("error while establishing connection");
    }
}