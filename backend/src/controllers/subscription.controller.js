import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "invalid channel id")
    }

    const userId = req.user?._id
    if (!userId) {
        throw new ApiError(400, "user not authenticated")
    }
    if (userId.toString() === channelId) {
        throw new ApiError(400, "you cannot subscribe to your own channel")
    }

    const existingSubscription = await Subscription.findOne({
        channel: channelId,
        subscriber: userId
    })

    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200)
            .json(new ApiResponse(200, null, "subscription removed successfully"))
    }
    else{
        const newSubscription=await Subscription.create({
            subscriber:userId,
            channel:channelId
        })
        return res.status(200)
        .json(new ApiResponse(200, newSubscription, "subscription added successfully"))
    }
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "invalid channel id")
    }

    const subscribers=await Subscription.find({
        channel:channelId
    }).populate("subscriber","username fullname avatar")

    return res.status(200)
        .json(new ApiResponse(200, subscribers, "subscriber list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!mongoose.Types.ObjectId.isValid(subscriberId)) {
        throw new ApiError(400, "invalid subscriber id")
    }

    const subscribedChannels=await Subscription.find({
        subscriber:subscriberId
    }).populate("channel", "username fullname avatar")
    
    return res.status(200)
        .json(new ApiResponse(200, subscribedChannels, "channels user has subscribed fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}