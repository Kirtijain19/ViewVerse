import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { upload } from "../middlewares/multer.middleware.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination

    const matchStage = {}
    if (query) {
        matchStage.title = { $regex: query, $options: "i" }
        // $regex makes partial matching possible
        // $options:"i" makes it case-insensitive
    }

    // If a specific userId is given, only that user’s videos are fetched.
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        matchStage.owner = new mongoose.Types.ObjectId(userId)
    }

    const sortStage = {}
    if (sortBy) {
        sortStage[sortBy] = sortType === "desc" ? -1 : 1
    }
    else {
        sortStage.createdAt = -1
    }

    const video = Video.aggregate([
        {
            $match: matchStage
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $sort: sortStage
        }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const videos = await Video.aggregatePaginate(video, options)

    return res.status(200)
        .json(new ApiResponse(200, videos, "all videos fetched successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video
    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const videoLocalPath=req.files?.videoFile?.[0]?.path
    const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400, "Video and thumbnail are required")
    }

    const videoFile=await uploadOnCloudinary(videoLocalPath)
    const thumbnail=await uploadOnCloudinary(thumbnailLocalPath)

    const video=await Video.create({
        videoFile:videoFile.url,
        thumbnail:thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner:req.user._id,
        isPublished:true
    })


    return res.status(200)
        .json(new ApiResponse(200, video, "video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    video.views+=1
    await video.save()
    
    return res.status(200)
        .json(new ApiResponse(200, video, "video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description, thubnail } = req.body
    //TODO: update video details like title, description, thumbnail

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you can update your own videos only")
    }

    let thumbnailUrl = video.thubnail
    if (req.files?.thumbnail?.[0].path) {
        const thumbnailUpload = await uploadOnCloudinary(req.files.thubnail[0].path)
        thumbnailUrl = thumbnailUpload.url
    }

    video.title = title || video.title
    video.description = description || video.description
    video.thubnail = thumbnailUrl
    await video.save()

    return res.status(200)
        .json(new ApiResponse(200, video, "video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you can delete your own videos only")
    }

    await video.deleteOne()

    return res.status(200)
        .json(new ApiResponse(200, null, "video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(404, "video not found")
    }

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(400, "you can change toggle status of your own videos only")
    }

    video.isPublished = !video.isPublished

    // const publishStatus=video.isPublished
    // if(publishStatus) video.isPublished=false
    // else video.isPublished=true

    await video.save()

    return res.status(200)
        .json(new ApiResponse(200, video.isPublished, "publish status toggled successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}