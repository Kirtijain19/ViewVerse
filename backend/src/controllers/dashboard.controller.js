import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId=req.user?._id || req.params.channelId
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "invalid channel id")
    }

    const totalVideos= await Video.countDocuments({owner:channelId})

    const totalSubscribers= await Subscription.countDocuments({channel:channelId})

    const videoStats=await Video.aggregate([
        {
            $match:{ // Filters videos that belong to this channel only.
                owner:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $group:{ // Groups all those videos into one combined record (_id: null means one group).
                _id:null,
                totalViews:{$sum:"$views"},
            }
        }
    ])

    const totalViews=videoStats[0]?.totalViews || 0

    const totalLikes=await Like.countDocuments({
        video:{$in: await Video.find({owner:channelId}).distinct("_id")}
    })
    // First, get all the video IDs of the channel
    // Then, check in the Like collection how many Like documents exist for those videos.

    const stats={
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes
    }

    return res.status(200)
    .json(new ApiResponse(200, stats, "channel stats fetched successfully"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const channelId=req.params.channelId || req.user?._id
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400, "invalid channel id")
    }

    const videos=await Video.find({owner:channelId})
    .sort({createdAt:-1})
    .populate("owner", "username fullname avatar")
    .lean()  //“Don’t wrap the result in Mongoose document instances — just give me plain JSON-like JavaScript objects.”

    if(!videos || videos.length==0){
        throw new ApiError(404, "no videos found for this channel")
    }

    return res.status(200)
    .json(new ApiResponse(200, videos, "channel videos fetched successfully"))

})

export {getChannelStats, getChannelVideos}