import { MongoGridFSChunkError } from "mongodb";
import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema=  new mongoose.Schema({
   videofile : {
        type: String, 
        require: true
    }, 
    thumbnail: {
        type: String, 

    }, 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title: {
        type: String, 

    }, 
    description: {
        type: String
    }, 
    duration: {
        type: String  ///Cloudinary
    }, 
    view: {
        type: Number,
        default: 0,

    },
    isPublished: {
        type: Boolean
    }, 
  

}, {timestamps: true});

videoSchema.plugin(mongooseAggregatePaginate)
export const Video =  mongoose.model("Video", videoSchema);