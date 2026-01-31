import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ThumbsUp } from "lucide-react";
import { getVideoById } from "../services/videoService.js";
import { addComment, deleteComment, getComments, updateComment } from "../services/commentService.js";
import { formatCompactNumber, formatTimeAgo } from "../utils/formatters.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { getUserById, getUserChannelProfile } from "../services/userService.js";
import { toggleCommentLike, toggleVideoLike } from "../services/likeService.js";
import { addVideoToPlaylist, getUserPlaylists } from "../services/playlistService.js";
import { toggleSubscription } from "../services/subscriptionService.js";

const Watch = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState(null);
  const [owner, setOwner] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [commentAction, setCommentAction] = useState({ id: null, message: "" });
  const [videoLiked, setVideoLiked] = useState(false);
  const [commentLikes, setCommentLikes] = useState({});
  const [channelProfile, setChannelProfile] = useState(null);
  const [channelProfileLoading, setChannelProfileLoading] = useState(false);

  const loadComments = async () => {
    try {
      const response = await getComments(videoId, { page: 1, limit: 10 });
      setComments(response?.data?.docs || []);
    } catch (error) {
      setComments([]);
    }
  };

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const response = await getVideoById(videoId);
        const loadedVideo = response?.data || null;
        setVideo(loadedVideo);
        setVideoLiked(loadedVideo?.isLiked || false);
        if (loadedVideo?.owner) {
          const ownerResponse = await getUserById(loadedVideo.owner);
          setOwner(ownerResponse?.data || null);
        }
      } catch (error) {
        setVideo(null);
      } finally {
        setLoading(false);
      }
    };

    loadVideo();
    loadComments();
  }, [videoId]);

  useEffect(() => {
    const loadChannelProfile = async () => {
      if (!owner?.username) return;
      setChannelProfileLoading(true);
      try {
        const response = await getUserChannelProfile(owner.username);
        setChannelProfile(response?.data || null);
      } catch (error) {
        setChannelProfile(null);
      } finally {
        setChannelProfileLoading(false);
      }
    };

    loadChannelProfile();
  }, [owner?.username, user?._id]);

  useEffect(() => {
    const loadPlaylists = async () => {
      if (!user) return;
      try {
        const response = await getUserPlaylists(user._id);
        setPlaylists(response?.data || []);
      } catch (error) {
        setPlaylists([]);
      }
    };

    loadPlaylists();
  }, [user]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (!commentText.trim()) return;
    await addComment(videoId, { content: commentText });
    setCommentText("");
    loadComments();
  };

  const handleLike = async () => {
    setActionMessage("");
    try {
      await toggleVideoLike(videoId);
      setVideoLiked((prev) => !prev);
      setActionMessage("Like updated.");
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to like video.");
    }
  };

  const handleAddToPlaylist = async () => {
    if (!selectedPlaylistId) return;
    setActionMessage("");
    try {
      await addVideoToPlaylist(videoId, selectedPlaylistId);
      setActionMessage("Added to playlist.");
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to add to playlist.");
    }
  };

  const handleCommentLike = async (commentId) => {
    setCommentAction({ id: commentId, message: "" });
    try {
      await toggleCommentLike(commentId);
      setCommentLikes((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
      setCommentAction({ id: commentId, message: "Comment like updated." });
    } catch (error) {
      setCommentAction({ id: commentId, message: error?.response?.data?.message || "Unable to like comment." });
    }
  };

  const handleCommentEdit = async (comment) => {
    const newContent = window.prompt("Edit comment", comment.content);
    if (newContent === null) return;
    try {
      await updateComment(comment._id, { newcontent: newContent });
      loadComments();
    } catch (error) {
      setCommentAction({ id: comment._id, message: error?.response?.data?.message || "Unable to update comment." });
    }
  };

  const handleCommentDelete = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");
    if (!confirmed) return;
    try {
      await deleteComment(commentId);
      loadComments();
    } catch (error) {
      setCommentAction({ id: commentId, message: error?.response?.data?.message || "Unable to delete comment." });
    }
  };

  const handleSubscribe = async () => {
    if (!channelProfile) return;
    setActionMessage("");
    try {
      await toggleSubscription(channelProfile._id);
      const refreshed = await getUserChannelProfile(channelProfile.username);
      setChannelProfile(refreshed?.data || channelProfile);
      setActionMessage("Subscription updated.");
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to subscribe.");
    }
  };

  if (loading) {
    return <div className="h-96 rounded-3xl border border-slate-900 bg-slate-900/50" />;
  }

  if (!video) {
    return <p className="text-sm text-slate-400">Video not found.</p>;
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[2fr,1fr]">
      <div>
        <div className="overflow-hidden rounded-3xl border border-slate-900 bg-slate-900">
          <video src={video.videoFile} controls className="h-[420px] w-full bg-black" />
        </div>
        <div className="mt-6">
          <h1 className="text-2xl font-semibold text-white">{video.title}</h1>
          <p className="mt-2 text-sm text-slate-400">{video.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>{formatCompactNumber(video.views)} views</span>
            <span>{formatTimeAgo(video.createdAt)}</span>
            {user && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                    videoLiked
                      ? "border-brand-400 text-brand-200"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  <ThumbsUp className={`h-4 w-4 ${videoLiked ? "fill-brand-400" : "fill-transparent"}`} />
                  <span>{videoLiked ? "Liked" : "Like"}</span>
                </button>
                {owner && user._id !== owner._id && (
                  <Button
                    variant={channelProfile?.isSubscribed ? "secondary" : "outline"}
                    size="sm"
                    className={channelProfile?.isSubscribed ? "bg-brand-500/20 text-brand-200 border-brand-400" : ""}
                    onClick={handleSubscribe}
                    disabled={channelProfileLoading}
                  >
                    {channelProfileLoading
                      ? "Loading..."
                      : channelProfile?.isSubscribed
                        ? "Subscribed"
                        : "Subscribe"}
                  </Button>
                )}
                <select
                  value={selectedPlaylistId}
                  onChange={(event) => setSelectedPlaylistId(event.target.value)}
                  className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="">Add to playlist</option>
                  {playlists.map((playlist) => (
                    <option key={playlist._id} value={playlist._id}>
                      {playlist.name}
                    </option>
                  ))}
                </select>
                <Button size="sm" variant="secondary" onClick={handleAddToPlaylist}>
                  Add
                </Button>
              </div>
            )}
          </div>
          {actionMessage && <p className="mt-2 text-xs text-slate-400">{actionMessage}</p>}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-900 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Comments</h2>
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-4 flex gap-3">
              <Input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Share your thoughts"
              />
              <Button type="submit">Post</Button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-slate-500">Sign in to leave a comment.</p>
          )}
          <div className="mt-6 space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="flex gap-3">
                <img
                  src={comment.owner?.avatar}
                  alt={comment.owner?.fullname}
                  className="h-10 w-10 rounded-full border border-slate-800 object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100">{comment.owner?.fullname}</p>
                  <p className="text-sm text-slate-400">{comment.content}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    {user && (
                      <button
                        type="button"
                        onClick={() => handleCommentLike(comment._id)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition ${
                          commentLikes[comment._id]
                            ? "border-brand-400 text-brand-200"
                            : "border-slate-700 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <ThumbsUp
                          className={`h-4 w-4 ${commentLikes[comment._id] ? "fill-brand-400" : "fill-transparent"}`}
                        />
                        <span>{commentLikes[comment._id] ? "Liked" : "Like"}</span>
                      </button>
                    )}
                    {user?._id === comment.owner?._id && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleCommentEdit(comment)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCommentDelete(comment._id)}>
                          Delete
                        </Button>
                      </>
                    )}
                    {commentAction.id === comment._id && commentAction.message && (
                      <span className="text-xs text-slate-500">{commentAction.message}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/60 p-6">
          <h3 className="text-sm font-semibold text-slate-200">Channel</h3>
          <div className="mt-4 flex items-center gap-3">
            <img
              src={owner?.avatar}
              alt={owner?.fullname}
              className="h-12 w-12 rounded-full border border-slate-800 object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-white">{owner?.fullname}</p>
              <p className="text-xs text-slate-500">@{owner?.username}</p>
            </div>
          </div>
          {owner?.username && (
            <Link
              to={`/channel/${owner.username}`}
              className="mt-4 inline-flex text-sm text-brand-300"
            >
              Visit channel
            </Link>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Watch;
