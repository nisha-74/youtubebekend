import { Router } from "express";
import { verifyJWTToken } from "../middlewares/auth.middlewares.js";
import { addComment, deleteCommentById, upDateComment } from "../controllers/comment.controllers.js";

const router = Router();

router.route('/addcoment').post(verifyJWTToken, addComment);

router.route('/update-comment/:id').patch(verifyJWTToken,upDateComment );
router.route('/delete-comment/:id').delete(verifyJWTToken, deleteCommentById);


export default router