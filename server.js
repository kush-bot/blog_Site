import express from 'express'
import { connectDb } from './Helpers/db.connection.js';
import dotenv from 'dotenv'

dotenv.config()

const app = express();

app.use(express.json({
    inflate:true,
    verify:(req,res,buf)=>{
        console.log('req',req);
        console.log('buf',buf)
    }
}));

await connectDb();

app.use(express.static('public',{
    dotfiles:'deny'
}))

app.use(express.static('fallback'))






app.listen('3000',()=>{
    console.log("server is running on 3000")
})




