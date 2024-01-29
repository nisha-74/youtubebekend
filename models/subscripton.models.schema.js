import { Timestamp } from "mongodb";
import mongoose from "mongoose";



const subScriptionSchema= mongoose.Schema({
  
    subscriber: {
        type: mongoose.Schema.Types.ObjectId, // one Who is subcribing  
        ref: "User"
    }, 
    channel:{
        type: mongoose.Schema.Types.ObjectId,  // One whome is Subcriber which is  subcribing channel  
        ref: "User"
    }
}, {Timestamp: true});
const Subscription = mongoose.model("Subscription", subScriptionSchema);
export { Subscription}

