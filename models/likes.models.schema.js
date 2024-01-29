import mongoose from "mongoose";


const likesSchema= ({
     Comment: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Comment"
     }, 
     video: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Video"
     },
     likedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
     },
     tweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet"
     }
})

const  Like = mongoose.model("Like", likesSchema);
export {
    Like
}