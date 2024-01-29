import mongoose from "mongoose";


const commentSchema= mongoose.Schema({

    content: {
        type: String, 
    }, 

    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }


}, {timestamps: true});

const  Comment = mongoose.model("Comment", commentSchema);
export {
    Comment
}

