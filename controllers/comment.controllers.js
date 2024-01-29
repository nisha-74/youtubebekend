

// getVideo comment 

import { APiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/ayncHandler.js";
import { Comment } from "../models/comment.models.schema.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// addComment



const addComment = asyncHandler ( async (req, res)=> {
    const {content} = req.body;

    console.log("Hey I M USERRRRRRR..", req.user._id);
    if(!content){
        throw new APiError(400 , "Content is required");

    }
    const existingContent = await Comment.findOne({content})   ;
    console.log("existing------", existingContent);
    if(existingContent){
        throw new APiError(409, "This comment is alredy exits");
    } 

    const comment  =   await Comment.create({
        content : content,
        owner: req.user._id
    })
    

    return res.status(200)
    .json(new ApiResponse(200 , {comment}, ' comment is successfull created.'));


})


//updateComment


const upDateComment = asyncHandler( async (req, res)=> {
    const {id}= req.params;

    const  {content} = req.body;

    

    const comment=   await Comment.findByIdAndUpdate(id, {
        $set: {
            content : content,
           
        }, 
       
     }, {new :  true}); 
 
   
     if(!comment){
        throw new APiError(404, "Comment Data is not found  ")
     }

     res.status(200).json(new ApiResponse(200, comment, "Comment is SuccessFully updated"));


})


// delete comment

  const deleteCommentById=  asyncHandler (async (req, res)=> {

    const {id}= req.params; 
  
     const existingComment= await Comment.findById(id);
     
     if(existingComment){
        throw new APiError(404, "Comment is not found.. ")
     }

    const deleteComment  = await Comment.findByIdAndDelete(id);
     

    res.status(200).json(new ApiResponse(200 ,  " Comment is Deleted By id "));
  })
//




export{
   addComment,
   upDateComment, 
   deleteCommentById
}