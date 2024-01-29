import { Router } from "express";
import { verifyJWTToken } from "../middlewares/auth.middlewares.js";
import { addPlayList } from "../controllers/playlist.controller.js";
import { upload } from '../middlewares/multer.middleware.js'


const router = new Router();

router.route("/addPlayList").post(
   

    verifyJWTToken, addPlayList);


export  default router;