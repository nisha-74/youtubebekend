import mongoose from "mongoose";

const playListShema=   mongoose.Schema({
    name: {
        type: String , 
        require: true
       
    }, 
    description: {
        type: String , 
        require: true,
      
    }, 
    video : [{
        type : mongoose.Schema.Types.ObjectId, 
        ref: "Video", 

    }], 
    cretaedBy: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }
})
const  Playlist = mongoose.model("Playlist", playListShema);
export{ Playlist}