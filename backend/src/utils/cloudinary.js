// first we will temporarily store our files on our server using multer,
// then upload on cloudinary and delete from server

import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import path from "path"
// fs is file system, integrated in node.js


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        // ensure the path is absolute
        const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.join(process.cwd(), localFilePath)
        //upload the file on cloudinary
        const response=await cloudinary.uploader.upload(absolutePath,{
            resource_type:"auto"
        })
        if (fs.existsSync(absolutePath)) {
            try { fs.unlinkSync(absolutePath) } catch(e){}
        }
        return response
    }
    catch(error){
        console.error("Cloudinary upload failed:", error?.message || error)
        if (localFilePath) {
            const absolutePath = path.isAbsolute(localFilePath) ? localFilePath : path.join(process.cwd(), localFilePath)
            if (fs.existsSync(absolutePath)) {
                try { fs.unlinkSync(absolutePath) } catch(e){}
            }
        }
        throw new Error("cloudinary upload failed")
    }
}

export {uploadOnCloudinary}