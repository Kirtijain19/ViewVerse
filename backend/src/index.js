// require('dotenv').config({path:'./env'})   //correct h but consistency kharab krra h

import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})


// connectDB is a synchronous method which returns a promise
connectDB()
.then(()=>{
    const port = process.env.PORT || 8000;
    const server = app.listen(port, '127.0.0.1', ()=>{
        console.log(`server is running at ${port}`)
        try{
            console.log('server address:', server.address())
        }catch(e){
            console.log('could not get server address', e.message)
        }
    })
})
.catch((err)=>{
    console.log("mongoDB connection failed",err)
})

/*
import express from "express"
const app=express()

//IIFI taki vo turant execute ho jae
// EEFI start krne se phle semicolon use krte h kyi baar taki agr previous line me na ho semicolon to dikkat na aae
;(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log(error)
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on ${process.env.PORT}`)
        })
    }catch(error){
        console.error(error)
        throw error
    }
})()
*/


// app.on is used to listen for built in or custom events, it does not start the server
// app.listen is used to start the HTTP server and begin listening for incoming client requests.
// app.use for middleware or configuration settings