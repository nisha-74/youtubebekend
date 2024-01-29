import  connectDB  from "./db/index.js";
import dotenv from 'dotenv';
import { app } from "./src/app.js";

//require('dotenv').config({path: './env'})
dotenv.config({ path: './.env' });




connectDB().then(()=> {
    app.listen(process.env.PORT, ()=>{
        console.log("Server is running this port",process.env.PORT);
    })

})
.catch((error)=> {
     console.log("DB connection is failed !!!!");
})







