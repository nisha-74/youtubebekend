import { asyncHandler  } from "../utils/ayncHandler.js"
 import {APiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.model.schema.js"
import { uploadFileOnCloudnary} from "../utils/Cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"

import jwt from "jsonwebtoken";
import mongoose from "mongoose";




const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}

    } catch (error) {
        throw new APiError(500, "Something went wrong while generating referesh and access token")
    }
}



/// USER REGISTER  

const  registerUser = asyncHandler( async (req, res)=> {
    /**
     * Get  input from user 
     * validation
     * if user is alredy exit or not : username , email
     * check for image 
     * uplod them on cloudnary
     * create user object 
     * removed password and refresh token field 
     * check fro user creatin
     * return res
     
     */

//    res.status(200).json({
//         message: "code with nisha", 
//     })
     const {username, email, fullname, password}= req.body;
     console.log("emial", email, password);
     if(
        [username , email, fullname, password].some( (filed)=> 
            filed ?.trim() === "")
      
     ){
        throw new APiError(400, "All field are require")
     }

    const existingUser=  await User.findOne(
        {
            $or:[{username}, {email}]
        }
     )
     if(existingUser){
        throw  new APiError(
            409, " User is alredy exist", []
        )
     }
     const avatarfilePath = await req.files?.avatar[0].path
     console.log("image************************* ", avatarfilePath);

     let coverImagePath;
     if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImagePath  = await req.files?.coverImage.path
     }
  
    if(!avatarfilePath){
        throw  new APiError(400, "avatar file is required")
     }

     const avatar= await  uploadFileOnCloudnary(avatarfilePath);
    
     const coverImage = await uploadFileOnCloudnary(coverImagePath);

     if(!avatar){
        throw  new APiError(400, "avatar file is required")
     }

     //Save in Database
    const user = await User.create({
        fullname: fullname, 
        avatar: avatar.url,
        coverImage:coverImage?.url || "",
        username:username,
        email:email, 
         password:password, 

        
     })
    const createdUser= await User.findById(user._id).select(
        " -password -refresToken"
    );
    if(!createdUser){
        throw new APiError(500, "Something went to wrong");
    }

    return   res.status(200).json(
    new ApiResponse(200, createdUser , "Registration is Successfull..."))
})



//// USER LOGIN

const userLogin= asyncHandler( async (req,res)=> {
  ///  get data from user 
  // useremail or email
  // user is exit or 
  // check password 
  // access and refresh token 
  //send cookies 
  
  const {username , email, password} = req.body;
  console.log("user name +++++++++++", email, password)

  if(!username && !email){
      throw new  APiError(400, "username or email is required ");
  }

    //const user=  await User.findOne({$or: [{username}, {email}]})

    console.log('Username:', username);
    console.log('Email:', email);
    const user = await User.findOne({ $or: [{ username }, { email }] });

    console.log("logged user", user);
    if(!user){
        throw new APiError(404, "User is not found");
        
    }
   let isPassword ;
    if (user && typeof user.isPasswordCorrect === 'function') {
        isPassword= await user.isPasswordCorrect(password);

        console.log(isPassword ," *********************************");
    }
    console.log(isPassword ," *********************************");

    if(!isPassword){
        throw new APiError(401, "Password is  Incrrect ");
    }

 

  const {accessToken, refreshToken} =  await generateAccessAndRefereshTokens(user._id);
      //send cookies
      const loggedInUser=  await User.findById(user._id).select(" -password -refresToken ")

      const option= {
        httpOnly: true, 
        secure: true
      }

      return res
      .status(200).cookie("accessToken", accessToken, option).
      cookie("refreshToken" ,refreshToken, option).json(
        new ApiResponse(200, {user: loggedInUser , accessToken , refreshToken}, "Login is successful...")
      )


})
  

////USER LOGOUT 

const userLogOut = asyncHandler(async (req, res) => {

    await  User.findByIdAndUpdate(
        req.user._id , {
            $unset: {
               refreshToken: 1
            }
        }, {
            new: true
        },

       
    )
    const option= {
        httpOnly: true, 
        secure: true
      }

   return res.status(200).clearCookie('accessToken',option)
   .clearCookie('refreshToken', option)
   .json({ success: true, message: 'Logout successful' });


});



//// REFRESHTOKEN
const refrsheAccessToken = asyncHandler(async(req, res)=> {

    const incomingToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingToken){
        throw new APiError(401, "Unauthorized");
    }
   try{
    const decodedToken=  jwt.verify(
        incomingToken, 
       process.env.REFRESH_TOKEN_SECRET
     )
     const user= User.findById(decodedToken?._id)
      if(!user){
         throw new APiError(401, " Invalid refresh Token ")
      }
 
      if(incomingToken !== user?.refresToken){
         throw new APiError(401, "Token is expired or used ")
      }
 
      const option= {
         httpOnly : true, 
         secure: true
      }
 
    const {accessToken , newResfreshToken} =  await generateAccessAndRefereshTokens(user._id);
 
    return res.status(200).cookie("accessToken",accessToken, option)
    .cookie("refreshToken", newResfreshToken, option)
     .json(new ApiResponse(200, {accessToken, refrsheAccessToken: newResfreshToken}, "Access Token Refreshed "))
   }
   catch(e){
     throw new APiError (500, e?.message || " Internal server error ");
   }
    
}); 

///CHANGED PASSWORD

const changePassword=  asyncHandler( async(req, res)=> {
    const { oldpassword , newPassword} = req.body;

    const  user = await User.findById(req.user._id);
    const ispasswordCarrect = await user.isPasswordCorrect(oldpassword);
    if(!ispasswordCarrect){
        throw new APiError(400, "Invalid Password");
    }

     user.password == newPassword
     await user.save ();
     console.log("Password", user.password);

    return res.status(200)
    .json(new ApiResponse(200,  "Password is SuccessFull update"))  ; 

})


////GET CURRENT CUSER
const getCurrebtUser= asyncHandler (async (req, res)=> {
    return res.status(200)
    .json(new ApiResponse(200, req.user, "Current user is fetched Successful"));
})


///UPDATE ACCOUNT DETAIL
const updateAccountDetail = asyncHandler (async (req, res)=> {
    const {fullname , email} = req.body; 
    if( !fullname &&  !email){
        throw new APiError(400, " fullanem or email is required");
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullname :fullname,
            email: email

        }
    }, 
        // updated record return
        {new : true}
    ).select("-password")

    return res.status(200)
    .json(new ApiResponse(200, user, " user Account is updated successfully"));


})


///UPDATE UPDATE USER AVATAR

const updateUserAvtar = asyncHandler ( async (req, res)=> {
     const avtarLocalPath = req.file?.path;
     if(!avtarLocalPath){
        throw new APiError(400 , " File is missing ");
     }
    const avatar =  await uploadFileOnCloudnary(avtarLocalPath)
    if(!avatar?.url){
        throw new APiError(400 , " Error while uploading the avtar ")
    }

   const user= await User.findByIdAndUpdate(
        req.user?._id, 
        {
             $set : {
                avatar : avatar.url
             }
        }, 
        {
            new: true
        }
    ).select( " -password")

    res.status(200).json(new ApiResponse(200 , {user}, "Avatar image is successfull updated .."));


     
})


////UPDATE COVER IMAGE

const updateCoverAvtar = asyncHandler ( async (req, res)=> {
    const coverLocalPath = req.file?.path;
    if(!coverLocalPath){
       throw new APiError(400 , " File is missing ");
    }
   const coverImg =  await uploadFileOnCloudnary(coverLocalPath)
   if(!coverImg?.url){
       throw new APiError(400 , " Error while uploading the  cover Image")
   }

   const user=  await User.findByIdAndUpdate(
       req.user?._id, 
       {
            $set : {
               coverImage: coverImg.url
            }
       }, 
       {
           new: true
       }
   ).select( " -password")
   res.status(200)
   .json( new ApiResponse(200, user, "cover image  is updated Successfully..."))

    

})

///GET CURRENT USER CHANNEL


 const getCurrentUserChnnel = asyncHandler (async (req, res)=> {
    const {username}= req.params;


    if(!username?.trim()){
        throw new APiError(400, " username is missing");
    }

    const channel = User.aggregate([
        {
            $match : {
                username: username
            }
        },
            {
                $lookup: {
                   from: "subscriptions", 
                   localField:" _id ",
                   foreignField: "channel",
                   as: " subscribers"


                }
            },

            {
                $lookup: {
                    from: "subscriptions", 
                    localField: "_id", 
                    foreignField: "subscriber", 
                    as: " subscribedTo "
                }
            }, 
            {
                $addFields: {
                    subscriberCount: {
                        $size: "$subscribers"

                    
                    },

                    channelSuscribedToCount: {
                        $size: "$subscribedTo"
                    }, 

                    isSuscribed: {
                        $cond: {
                            if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                            then: true, 
                            else: false
                        }
                    }
                }


            },

            {
                $project: {
                    fullname: 1,
                    username: 1, 
                    subscriberCount:1,
                    channelSuscribedToCount:1, 
                    isSuscribed:1, 
                    coverImage: 1, 
                    avatar: 1, 
                    email:1


                }
            }
        
    ])
    console.log(" Channel value ..... ",channel)

    if(!channel?.length){
        throw new APiError(400, "Channel does not exits")

    }
    console.log(channel)
    return res.status(200)
    .json(
        new ApiResponse(200 , " Channel is fetched successfull ...")
    )
 })


 ////GET WATCHED HISTORY

const getWatchedHistory = asyncHandler ( async (req, res)=> {
    const ObjectId = mongoose.Types.ObjectId;

    const user =  await User.aggregate([
        {
          
            $match:{
                _id :new ObjectId(req.user._id)
            }
        }, 
        {
            $lookup: {
                from: "videos", 
                localField: "watchedHistory",
                foreignField: "_id", 
                as:"watchedHistory", 
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id", 
                            as: "owner" ,
                            pipeline: [
                                {
                                    $project: {
                                        fullname:1, 
                                        username:1, 
                                        avatar:1,
                                    }
                                }

                            ]

                        }
                    }, 
                    {
                        $addFields: {
                            owner: {
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200).json(
        new APiError(200, user[0].watchedHistory, 
            "WatchHistory is successful...")
    );
    
})




export {
    registerUser,
    userLogin, 
    userLogOut, 
    refrsheAccessToken, 
    changePassword, 
    getCurrebtUser, 
    updateAccountDetail, 
    updateUserAvtar, 
    updateCoverAvtar, 
    getCurrentUserChnnel, 
    getWatchedHistory
}