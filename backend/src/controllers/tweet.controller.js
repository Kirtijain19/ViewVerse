import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content?.trim()){
        throw new ApiError(400, "content required for tweet")
    }

    const tweet=await Tweet.create({
        content,
        owner: req.user._id
    })

    return res.status(200)
    .json(new ApiResponse(200, tweet, "tweet created successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId}=req.params
    const {page=1, limit=10}=req.query

    if(!mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400, "invalid user id")
    }

    const user=await User.findById(userId)
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const tweet=Tweet.aggregate([   
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullname:1,
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        }
    ])

    const options={
        page:parseInt(page, 10),
        limit:parseInt(limit, 10),
    }

    const tweets=await Tweet.aggregatePaginate(tweet, options)

    return res.status(200)
    .json(new ApiResponse(200, tweets, "user tweets fetched successfully"))
})

const getAllTweets = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query

    const tweet = Tweet.aggregate([
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
            $sort: {
                createdAt: -1
            }
        }
    ])

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const tweets = await Tweet.aggregatePaginate(tweet, options)

    return res.status(200)
        .json(new ApiResponse(200, tweets, "all tweets fetched successfully"))
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params
    const {newcontent}=req.body
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }
    if(!newcontent?.trim()){
        throw new ApiError(400, "content required for updating tweet")
    }

    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }

    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(400, "you can update only your own tweet")
    }

    tweet.content=newcontent
    await tweet.save()

    return res.status(200)
    .json(new ApiResponse(200, tweet, "tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "invalid tweet id")
    }

    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404, "tweet not found")
    }

    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(400, "you can update only your own tweet")
    }

    await tweet.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200, null, "tweet deleted successfully"))
})

export {createTweet, getUserTweets, getAllTweets, updateTweet, deleteTweet}