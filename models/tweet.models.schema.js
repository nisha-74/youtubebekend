import mongoose  from "mongoose";

 const tweetShema=  mongoose.Schema({



})


const Tweet =  mongoose.model("Tweet", tweetShema)
export{
    Tweet
}