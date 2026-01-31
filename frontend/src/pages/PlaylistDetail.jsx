import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deletePlaylist, getPlaylistById, removeVideoFromPlaylist, updatePlaylist } from "../services/playlistService.js";

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const loadPlaylist = async () => {
    try {
      const response = await getPlaylistById(playlistId);
      setPlaylist(response?.data || null);
    } catch (error) {
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  const handleEdit = async () => {
    const newName = window.prompt("Update playlist name", playlist?.name || "");
    if (newName === null) return;
    const newDescription = window.prompt("Update playlist description", playlist?.description || "");
    if (newDescription === null) return;
    setActionMessage("");
    try {
      await updatePlaylist(playlistId, { name: newName, description: newDescription });
      setActionMessage("Playlist updated.");
      loadPlaylist();
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to update playlist.");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this playlist?");
    if (!confirmed) return;
    setActionMessage("");
    try {
      await deletePlaylist(playlistId);
      setActionMessage("Playlist deleted.");
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to delete playlist.");
    }
  };

  const handleRemoveVideo = async (videoId) => {
    setActionMessage("");
    try {
      await removeVideoFromPlaylist(videoId, playlistId);
      setActionMessage("Video removed from playlist.");
      loadPlaylist();
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to remove video.");
    }
  };

  if (loading) {
    return <div className="h-64 rounded-3xl border border-slate-900 bg-slate-900/60" />;
  }

  if (!playlist) {
    return <p className="text-sm text-slate-400">Playlist not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Playlist</p>
        <h1 className="mt-3 text-2xl font-semibold text-white">{playlist.name}</h1>
        <p className="mt-2 text-sm text-slate-400">{playlist.description}</p>
        <p className="mt-3 text-xs text-slate-500">{playlist.videos?.length || 0} videos</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:border-rose-400"
          >
            Delete
          </button>
        </div>
        {actionMessage && <p className="mt-2 text-xs text-slate-400">{actionMessage}</p>}
      </div>

      <div className="grid gap-4">
        {playlist.videos?.length ? (
          playlist.videos.map((video) => (
            <div
              key={video._id}
              className="flex items-center gap-4 rounded-2xl border border-slate-900 bg-slate-900/60 p-4"
            >
              <Link to={`/watch/${video._id}`} className="flex flex-1 items-center gap-4">
                <img src={video.thumbnail} alt={video.title} className="h-20 w-36 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{video.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{Math.ceil(video.duration || 0)}s</p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => handleRemoveVideo(video._id)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No videos in this playlist yet.</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetail;