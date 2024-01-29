import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

          
cloudinary.config({ 
  cloud_name: 'dnexjxtru', 
  api_key: '144223921517826', 
  api_secret: 'd-VYYQpLpZ6_Kg-Hm6_wzZKQqC0' 
});

const uploadFileOnCloudnary= async (localFilePath)=> {
   try{
    if(!localFilePath) return null;
    /// upload file on server 

    const response= await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    })
    

    // file has been uploade successful
    console.log("File is successfully uploaded", response.url);
    return response;
   }
   catch(err) {
    fs.unlinkSync(localFilePath);
    // removed the  locally saved file as the upload opertaion got failed

    return null;

   }
}

// cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });

export {
  uploadFileOnCloudnary
}