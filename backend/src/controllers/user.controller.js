import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose, { mongo } from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        //accessToken hum user ko de dete h but refreshToken hum db me bhi save krke rkhte h taki user se baar baar password na puchna pade

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { refreshToken, accessToken }
    }
    catch (error) {
        throw new ApiError(500, "something went wrong while generating access and refresh tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {


    // 1. get user details from frontend

    // form ya json se data aara h to req.body, url se aara h to we'll see later

    // console.log(req.body)
    const { email, password, fullname, username, } = req.body
    console.log("email", email)

    // res.status(200).json({
    //     message:"ok"
    // })

    // 2. validation

    // method 1
    // if(fullname===""){
    //     throw new ApiError(400,"fullname is required")
    // }

    if ([fullname, email, username, password].some((field) => field?.trim === "")) {
        throw new ApiError(400, "all fields are required")
    }

    // .some() is JS array method which checks whether atleast one element in array satisfies the given condition (the function inside)

    // 3. check if user already exists: through username, email

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    // .findOne()... if found returns document, else return null

    if (existedUser) {
        throw new ApiError(409, "same email or username already exists")
    }

    // 4. check for images, check for avatar

    // console.log(req.files)
    // console.log("req.files")
    const avatarLocalPath = req.files?.avatar[0].path
    // const coverImageLocalPath = req.files?.coverImage[0].path

    // coverImage pass krna was not mandatory, but jab pass nhi kiya to we got an error, so:
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is required 1")
    }

    // 5. upload them to cloudinary, check avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "avatar file is required 2")
    }

    // 6. create user object- create entry in db

    const user = await User.create({
        // fullname: fullname is same as fullname
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    // 7. remove password and refresh token field from response

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // 8. check for user creation

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    // 9. return response

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // 1. req body->data
    const { username, email, password } = req.body

    // 2. username or email based login
    // if (!(username || email)) {
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    // 3. find the user

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    // 4. check password

    // yha user lenge User (ye mongoDB, mongoose ka ek object h, jo inke through methods available h vha ise use krenge) nhi,
    // isPasswordCorrect aise methods jo humne bnae hai to ye hmare user me available h, hmara user mtlb "user" jo humne db se instance liya h
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "password incorrect")
    }

    // 5. access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // 6. send cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken,
                },
                "user logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {

    // we could not access user directly during logout
    // so we created auth.middleware.js, added its route
    // goal: req me ek object add krna user to access its id

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
                // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"))
})

// access tokens are short lived and refresh tokens are long lived.
// jb access token expire hua to user request krta h usme vo refresh token pass krta h, vo db me bhi store hota h
// to agar vo match kar jae, to new access and refresh tokens generate ho jate h, user firse login ho jata h instead of again entering credentials

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "invalid refresh token")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "refresh token is expired or used")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { newRefreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)


        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                { accessToken, newRefreshToken },
                "access token refreshed"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body

    // agar user password change krra h, means vo already logged in to hai
    const user = await User.findById(req.user?._id)

    const isOldPassCorrect = await user.isPasswordCorrect(oldPassword)
    if (!isOldPassCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = password
    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password changed successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body

    if (!fullname || !email) {
        throw new ApiError(400, "all fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname,
                email: email
            }
        },
        { new: true }
        // new:true se update krne ke baad wali new info return krta hai
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "account details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "error while uploading avatar")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "avatar uploaded successfully"))
})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        throw new ApiError(400, "cover image file is missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "error while uploading cover image")
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        {
            new: true
        }
    ).select("-password")

    return res.status(200)
        .json(new ApiResponse(200, user, "cover image uploaded successfully"))
})

// using mongoDB aggregation pipelines
// $match: filter document based on a condition
// $group: Groups documents by a specific key and performs aggregation functions like $sum, $avg, $max, $min, $count, etc.
// $project: Selects, modifies, or creates new fields in the output documents.
// $lookup: Performs a join operation between two collections

const getUserChannelProfile = asyncHandler(async (req, res) => {
    // find username from url
    const { username } = req.params
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {   // find subscribers, Find all documents in subscriptions where channel = this user’s _id.
            $lookup: {
                // model me we used Subscription, db me here we are searhing subscriptions
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        // {
        //     $lookup: {
        //         from: "subscriptions",
        //         localField: "_id",
        //         foreignField: "channel",
        //         as: "subscribers"
        //     }
        // },
        {  // Now it joins again — but this time finds all documents where this user’s _id appears as the subscriber.
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "subscribedTo"
                },
                isSubscribed: {
                    // $in checks whether the current logged-in user’s ID (req.user._id) exists inside the list of subscriber IDs ($subscribers.subscriber).
                    $cond: {
                        if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        { //$project specifies which fields to include in the final output.
          //1 means “include this field”, 0 means “exclude it”. 
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1
            }
        }
    ])
    
    // If the aggregation result array is empty ([]), that means no user found.
    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    // channel[0] because aggregate() returns an array, even if only one document matches.
    return res.status(200)
        .json(new ApiResponse(200, channel[0], "user channel fetched successfully"))

})

const getWatchHistory=asyncHandler(async (req,res)=>{
    // when we write req.user._id, we actually get a string, usko mongoDB ki id lene ke liye _id:ObjectId("...."), but while using mongoose
    // jab hum usko ye id dete h to vo automatically usko mongoDB ki id me convert krdeta hai
    const user=await User.aggregate([
        {
            $match:{
                //Normally Mongoose converts it automatically, but in aggregation pipelines, you must manually convert it using:
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[   // This lookup happens inside the videos lookup. It enriches each video with details of the user who uploaded it.
                    {
                        $lookup:"users",
                        localField:"owner",
                        foreignField:"_id",
                        as:"owner",
                        pipeline:[  // limits owner fields to only fullname, username, and avatar
                            {
                                $project:{
                                    fullname:1,
                                    username:1,
                                    avatar:1
                                }
                            }
                        ]
                    },
                    {
                        // Because $lookup creates an array (even if it finds just one matching document), $first picks the first element from the owner array and makes it a single object instead of an array.
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])
    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully"))
})

const getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, 'user id is missing');
    }
    const user = await User.findById(id).select('-password -refreshToken');
    if (!user) {
        throw new ApiError(404, 'user not found');
    }
    return res.status(200).json(new ApiResponse(200, user, 'user fetched successfully'));
});

export {
    registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails,
    updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory, getUserById
}