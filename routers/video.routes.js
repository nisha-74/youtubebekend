import { Router } from "express";
import { addVideo, getVideoById, updateVideo } from "../controllers/video.controllers.js";
import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWTToken } from "../middlewares/auth.middlewares.js";

const router = Router();;



router.route('/upload-video').post(
    upload.fields([
      {name : "videofile", maxCount :1}
    ]), 
  
    verifyJWTToken,
      addVideo
  
  );
  router.route('/getvideo/:id').get(verifyJWTToken, getVideoById);

  router.route('/update-video/:id').patch(verifyJWTToken, upload.single("videofile"),updateVideo) 


  export default router