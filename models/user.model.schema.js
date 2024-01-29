import mongoose from "mongoose";
import jwt from"jsonwebtoken";
 import bcrypt from "bcrypt";

const userShema= new mongoose.Schema({
    username: {
        type: String, 
        required: String, 
        unique: true, 
        index: true, 
        trim: true

    }, 
    email:{
        type: String, 
        required: String, 
        unique: true
    }, 
    fullname: {
        type: String , 
        require: String, 
         trim : true
    },
    avatar: {
        type: String, 
      
        
    }, 
    coverImage: {
        type: String
    }, 
    refresToken: {
        type: String 
    },
    password: {
        type: String, 
        
    } ,
   
    watchedHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }]
}, {timestamps: true});

userShema.pre("save", async function (next){

    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})


userShema.methods.isPasswordCorrect = async function
(password) {
  return  await  bcrypt.compare(password, this.password);

}
userShema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userShema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const  User= mongoose.model("User", userShema);