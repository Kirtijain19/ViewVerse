import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

// unique id har data model ke liye mongoose apne aap create krta h
const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true   // is we want to make our field searchable with optimization
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullname:{
            type:String,
            required:true,
            trim:true,
            index:true
        },
        avatar:{
            type:String,   // cloudinary url
            required:true
        },
        coverImage:{
            type:String
        },
        // watchhistory ke liye we do npm i mongoose-aggregate-paginate-v2
        watchHistory:[   // jo bhi video user dekhega uski id store kara lenge
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{  // npm i bcrypt which help you hash passwords
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{  // npm i jsonwebtoken (jwt)
            type:String
        }
    },{timestamps:true}
)


// do not use arrow function here, as it does not have reference to 'this', does not have context
// it is a middleware
userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    
    this.password=await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {   //payload (data)
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {   //payload (data)
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model('User', userSchema)

// jwt is a bearer token which means ki ye token jiske bhi pas hai m use data bhej dunga