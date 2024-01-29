
import { Video } from "../models/video.models.schema.js";
import { APiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileOnCloudnary } from "../utils/Cloudinary.js";
import { asyncHandler  } from "../utils/ayncHandler.js"

const getAllVideos= asyncHandler( async(req, res)=> {
    const { page=1, limit=10 , query , sortBy, sortTypes, userId}= req.query; 

    // get all video based on query , sort  pagination

})

const  addVideo = asyncHandler (async (req, res)=> {
    const  { title , description}= req.body;

    console.log("hey I am  here ", req.user._id);
    // upload all video on cloudnary .
    console.log(" firtstime", title , description);  

    if(!title  && !description){
        throw new APiError(400, " title or  description is required..")
    }


    const existingTitle = await Video.findOne({
        $or: [{ title }, { description }],
      });
    
  
     console.log(existingTitle)
    
    if(existingTitle){
        throw new APiError(409, "This title  or  description is alredy existing ");

    }
    const videoPath =  await req.files?.videofile[0].path
 
   
   console.log( " dsjkhjdskhks", videoPath);
    if(!videoPath || videoPath.length === 0){
        throw new APiError(400, " video  files is required");
    }

    const videoFileOnCloud= await  uploadFileOnCloudnary(videoPath);

    if(!videoFileOnCloud){
        throw new APiError(400, " something went to wrong in uploding the video ");
    }

    const video = await  Video.create(
         {
            title: title, 
            description: description, 
            videofile: videoFileOnCloud?.url, 
            owner:req.user._id
        }
    )
    return res.status(200).json(new ApiResponse(200, video, "Video is published successful.."))

})


///Get video By Id 


const getVideoById= asyncHandler (async (req, res)=> {
    const {videoId} = req.params;

   const video = Video.findById(videoId)
 

    if(!video){
        throw new APiError(404, " video is not found");
    }

    console.log(video);
    return res.status(200).json(new ApiResponse(200, {},  "video is found Successful..."))
  

})

/// Update Video 
const  updateVideo= asyncHandler ( async (req, res)=> {
    const  videofilePath = req.file?.path;
    const {videoId} = req.params;
    console.log("Hey   id id0000888 " ,req.user._id );

    console.log("Video files", videoId,_id);
    if(!videofilePath){
        throw new APiError(409, " File is missing ");

    }
    const uploadFilerOnserver= await uploadFileOnCloudnary(videofilePath);

    if(!uploadFilerOnserver?.url){
        throw new APiError (401, " Error updating the  video");

    }
    const video = await Video.findByIdAndUpdate(videoId, {
        $set:
        { 
            videofile:uploadFilerOnserver.url
        }, 
       
    }, 
    {
        new: true
    },);
   

  
    return res.status(200). 
    json(new ApiResponse(200 , {}, " video is updated successfull"));
})

/// Delete Video

const deletevideoById =  asyncHandler( async (req, res)=> {

    const  { id} = req.params;
    
      const video = await Video.findByIdAndDelete(id) ;
      if(!video){
        throw APiError(404, "Video is not found");
      }
    return res.status(200).json(ApiResponse(200, " Video is  Sucessful deleted.. "))
})


/// togol Publish Status 



export{
    addVideo, 
    getVideoById, 
    updateVideo, 
    deletevideoById


}
