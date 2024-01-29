import  express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from 'cors'


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true

}))

//CONFIGRATION

app.use(express.json({limit:"16kb"}));

//// When data is comming from url which convert your name + , %
app.use(express.urlencoded({extended: true , limit: "16kb"}));
///If you want to store image in server like image , pdf etc  here i m making public assets 
app.use(express.static("public"));
app.use(cookieParser());



////IMPORT ROUTES
import userRouter from '../routers/user.routers.js';
import videoRouter from '../routers/video.routes.js';
import commentRouter from'../routers/comment.routers.js';
import playlistRouter from '../routers/playlist.routers.js';






//router declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/comment", commentRouter );
app.use("/api/v1/playlist", playlistRouter);



export  {app}