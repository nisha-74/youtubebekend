import { Router } from "express";
import { 
  changePassword,
  getCurrebtUser, 
  getCurrentUserChnnel, 
  getWatchedHistory, 
  refrsheAccessToken, 
  registerUser,
  updateAccountDetail,
  updateCoverAvtar,
  updateUserAvtar,
  userLogOut, 
  userLogin
 } from "../controllers/user.controllers.js";


import { upload } from '../middlewares/multer.middleware.js'
import { verifyJWTToken } from "../middlewares/auth.middlewares.js";


const router = Router()

router.route("/signup").post(

    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
      ]),
      
   
    registerUser);

    router.route("/login").post(userLogin);
 ///secure logout
 
 router.route("/logout").post( verifyJWTToken , userLogOut);
 router.route("/refreshToken").post(refrsheAccessToken) ;
 router.route("/changed-password").post(verifyJWTToken, changePassword);
 router.route("/current-user").get(verifyJWTToken, getCurrebtUser); 
 router.route("/update-account").patch(verifyJWTToken, updateAccountDetail);
 router.route("/avtar-update").patch(verifyJWTToken, upload.single("avatar"), updateUserAvtar );
 router.route("/coverImg-update").patch(verifyJWTToken, upload.single("coverImage"), updateCoverAvtar);
 router.route("/c/:username").get(verifyJWTToken, getCurrentUserChnnel);
 router.route("/history").get(verifyJWTToken, getWatchedHistory);

export default router