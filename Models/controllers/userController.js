import User from '../userModel.js';
import jwt from 'jsonwebtoken';
import validator from 'validator'
import bcrypt from 'bcrypt';

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECREAT,{expiresIn:'3d'});
}

export const signup = async(req,res)=>{
    const {email,password,username}=req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Please provide email, password, and username' });
      }
    
    if(validator.isEmpty(username)){
        return res.status(400).json({isError:true,error:"username can't be empty"});
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({isError:true,error:"Invalid Email Format"});
    }

    if(password.length < 6){
        return res.status(400).json({
            isError:true,
            error:"password must at least 6 characters"
        })
    }


    try{

        const exist = await User.findOne({
            $or:[
                {email:email},
                {username:username}
            ]
        });

        if(exist){
            return res.status(500).json({
                isErrorP:true,
                error:"user already exist"
            })
        }

        const user = await User.signup(email,password,username);

        if(user){
            const token = createToken(user._id);
            console.log("the token",token)
            return res.status(200).json({user,token})
            
        }

        
    }
    catch(err){
        return res.status(500).json({
            isError:true,
            error:`internal server error ${err}`
        })
    }

    


}

export const login=async(req,res)=>{
    const {username,email,password}=req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            isError:true,
            error:"All the Fields are required"
        })
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            isError:true,
            error:"Invalid Email Format"
        })
    }

    if(validator.isEmpty(username)){
        return res.status(400).json({
            isError:true,
            error:"Username is required"
        })
    }

    if(password.length<6){
        return res.status(400).json({
            isError:true,
            eror:"password must be atleast 6 characters"
        })
    }

    try{
        const user = await User.findOne({
            $or:[
                {email:email},
                {username:username}
            ]
        }).select('+password')

        if(!user){
            res.status(400).json({
                isError:true,
                error:"user doesn't exist"
            })
        }
        console.log("login user",user)

        const match = await bcrypt.compare(password,user.password);
        if(!match){
            return res.status(400).json({
                isError:true,
                error:"password didn't match"
            })
        }

        const token = createToken(user._id)
        user.password=undefined;
        return res.status(200).json({
            user,token
        })
    }
    catch(err){
        return res.status(500).json({
            isError:true,
            error:`Internal Server Error ${err}`
        })
    }


}
