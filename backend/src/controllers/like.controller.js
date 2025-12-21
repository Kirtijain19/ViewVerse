import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: toggle like on video
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    // check if user already liked this video
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    })

    if (existingLike) {
        await existingLike.deleteOne()
        return res.status(200)
            .json(ApiResponse(200, null, "video unliked successfully"))
    }

    const like=await Like.create({
        video:videoId,
        likedBy:req.user._id
    })

    return res.status(200)
        .json(new ApiResponse(200, like, "video liked successfully"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    //TODO: toggle like on comment
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "invalid comment id")
    }

    const existingLike=Like.findOne({
        comment:commentId,
        likedBy:req.user._id
    })

    if(existingLike){
        await existingLike.deleteOne()
        return res.status(200)
        .json(ApiResponse(200, null, "comment unliked successfully"))
    }

    const like=await Like.create({
        comment:commentId,
        likedBy:req.user._id
    })

    return res.status(200)
        .json(new ApiResponse(200, null, "comment liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    //TODO: toggle like on tweet
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }

    const existingLike=Like.findOne({
        tweet:tweetId,
        likedBy:req.user._id
    })

    if(existingLike){
        await existingLike.deleteOne()
        return res.status(200)
        .json(ApiResponse(200, null, "tweet unliked successfully"))
    }

    const like=await Like.create({
        tweet:tweetId,
        likedBy:req.user._id
    })
    return res.status(200)
        .json(new ApiResponse(200, null, "tweet liked successfully"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    // ensure user is logged in
    if(!req.user?._id){
        throw new ApiError(400, "user not authenticated")
    }

    const likedVideos= await Like.find({
        likedBy:req.user._id,
        // ensures you only get likes that are for videos (and not for tweets or comments).
        video:{
            $exists:true
        }
    }).populate("video")   //This replaces the video ObjectId in each Like document with the actual Video document fetched from the videos collection.
    .sort({createdAt:-1})

    return res.status(200)
        .json(new ApiResponse(200, likedVideos, "liked videos fetched successfully"))
})

export {toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos}