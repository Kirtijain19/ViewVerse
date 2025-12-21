import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!videoId){
        throw ApiError(404, "video id not found")
    }
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw ApiError(400, "invalid video id")
    }

    const comment=Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
                // video ki id match karare h comment ki nhi, comment schema me video itself stores id, so no need of video._id
                // at this point, we are dealing with comment documents
                // each document still has _id, content, video, owner, createdAt, updatedAt, we have only filtered comments belonging to one video
            }
        },
        {
            // Go to the users collection. Find the document(s) where _id in users equals the owner field in the comment. Attach that data in a new array field called owner.
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
        { // addFields just simplifies owner
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $sort:{
                createdAt:-1 // latest comments first   
            }
        }
    ])

    const options={
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const comments= await Comment.aggregatePaginate(comment, options)

    return res.status(200).
    json(new ApiResponse(200,comments ,"commments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} =req.body
    const {videoId} =req.params

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id")
    }
    //if(content?.trim()===""){  // it will correctly check empty strings but if content is undefined or null it will fail, so use below version
    if(!content?.trim()){
        throw new ApiError(400, "comment content is required")
    }

    const comment= await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })

    return res.status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params
    const {newcontent}=req.body

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "invalid comment id")
    }
    if(!newcontent?.trim()){
        throw new ApiError(400, "updated content cannot be empty")
    }

    const comment= await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "comment not found")
    }

    if(comment.owner.toString()!==req.user._id.toString()){
        throw new ApiError(400, "you can update only your own comment")
    }

    comment.content=newcontent
    await comment.save()

    return res.status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId}=req.params
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "invalid comment id")
    }

    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "comment not found")
    }

    if(comment.owner.toString()!==req.user._id.toString()){
        throw new ApiError(400, "you can delete only your comment")
    }

    await comment.deleteOne()

    return res.status(200)
    .json(new ApiResponse(200, null, "comment deleted successfully"))
})

export {getVideoComments, addComment, updateComment, deleteComment}