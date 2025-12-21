// first we will temporarily store our files on our server using multer,
// then upload on cloudinary and delete from server

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
// fs is file system, integrated in node.js


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been uploaded successfully
        // console.log("file is uplaoded on cloudinary", response.url)
        // console.log(response)
        // console.log("response")
        fs.unlinkSync(localFilePath)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath)
        // remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}