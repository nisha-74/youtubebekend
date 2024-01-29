

// create Play list

import { Playlist } from "../models/playlist.models.schema.js";
import { Video } from "../models/video.models.schema.js";
import { APiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileOnCloudnary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/ayncHandler.js";


// add play list

const addPlayList = asyncHandler(async (req, res) => {

    const {name , description} = req.body;
    if (!name || !description) {
        throw new APiError(401, " name and description is missing ");
    }
   const existingTitle = await Playlist.findOne({name});
    if(existingTitle){
    throw new APiError(409 , "Title is alredy exist");
   }
   const video =  await Video.find({ owner: req.user._id });
   const videoIds = video.map(video => video._id);
    console.log("list of video********************************************* ", video.length, videoIds);


    const playlist = await Playlist.create({
        name: name,
        description: description,
        cretaedBy: req.user._id,
        video: videoIds
             
    })
  
    return res.status(200).json(new  ApiResponse(200,  playlist , " PlayList is created successfull..."));

})



// get User Play list


// getPlay list By id


/// addVideoPlayList


// removeVideoPlaylist


// delete play list


// update play list 



export {
    addPlayList
}
