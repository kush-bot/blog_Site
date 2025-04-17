import express from 'express'
import { connectDb } from './Helpers/db.connection.js';
import dotenv from 'dotenv'
import userRoutes from './router/user.js'

dotenv.config()

const app = express();

app.use(express.json({
    inflate:true,
}));

await connectDb();

app.use(express.static('public',{
    dotfiles:'deny'
}))

app.use(express.static('fallback'))

app.use('/auth/',userRoutes);






app.listen('3000',()=>{
    console.log("server is running on 3000")
})




