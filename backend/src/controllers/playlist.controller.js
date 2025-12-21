import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name?.trim() || !description?.trim()) {
        throw new ApiError(400, "name and description are required")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })

    return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "invalid user id")
    }
    const playlist = await Playlist.find({
        owner: userId
    })
        .populate("videos", "title thumbnail duration")
        .sort({ createdAt: -1 })

    return res.status(200)
        .json(new ApiResponse(200, playlist, "user playlist fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail duration")
        .populate("owner", "username fullname avatar")

    if (!playlist) {
        throw new ApiError(404, "playlist not found")
    }

    return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist fetched from id successfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlist.videos.includes(videoId)){
        throw new ApiError(400, "video already exists in the playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200)
        .json(new ApiResponse(200, playlist, "video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "invalid video id")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400, "video does not exist in the playlist")
    }

    playlist.videos=playlist.videos.filter(
        (vid)=>vid.toString!==videoId.toString()
    )

    
    await playlist.save()
    
    return res.status(200)
        .json(new ApiResponse(200, playlist, "video removed from playlist successfully"))


})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    // TODO: delete playlist
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlistId.owner.toString()!==req.user?._id){
        throw new ApiError(400, "you can delete only your own playlists")
    }
    await playlist.deleteOne()

     return res.status(200)
        .json(new ApiResponse(200, null, "playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    //TODO: update playlist

    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "invalid playlist id")
    }

    const playlist=await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404, "playlist not found")
    }

    if(playlistId.owner.toString()!==req.user?._id){
        throw new ApiError(400, "you can update only your own playlists")
    }

    if(name?.trim()) playlist.name=name
    if(description?.trim()) playlist.description=description
    await playlist.save()
    
     return res.status(200)
        .json(new ApiResponse(200, playlist, "playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}