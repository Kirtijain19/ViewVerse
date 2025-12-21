const asyncHandler=(requestHandler)=>{
    return (req,res,next)  =>{
        Promise.resolve(requestHandler(req,res,next)).catch((err)=>next(err))
    }
}

export {asyncHandler}



// const asyncHandler=(fn)=> async (req,res,next)=>{
//     try{
//         await fn(req, res, next)
//     }
//     catch(err){
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }


// it is a higher order function that can accept a function as a parameter and also it cna return a function


// (arr, req,res,next) 4 parameters, next is a flag which implies the usage of middleware