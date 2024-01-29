

// const asynHandle = (fun) => async(req, res, next)=> {

//     try{

//         await fun(req, res, nex)
//     }
//     catch(err){
//         res.status(500).json({
//             sucess:false,
//             message: err.message
//         });
//     }
//  }


//OTHET METHOD


 const asyncHandler= (reqHandler)=> {
   return (req, res,next)=> {
        Promise.resolve(reqHandler (req, res , next)).catch((err)=> next(err))
    }

}
export {
    asyncHandler
}
