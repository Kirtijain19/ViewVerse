import { useEffect, useState } from "react";
import { getChannelStats } from "../services/dashboardService.js";
import { deleteVideo, getChannelVideos, togglePublishStatus, updateVideo } from "../services/videoService.js";
import { formatCompactNumber } from "../utils/formatters.js";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [actionMessage, setActionMessage] = useState("");

  const loadVideos = async () => {
    try {
      const response = await getChannelVideos();
      setVideos(response?.data || []);
    } catch (error) {
      setVideos([]);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getChannelStats();
        setStats(response?.data || null);
      } catch (error) {
        setStats(null);
      }
    };

    loadStats();
    loadVideos();
  }, []);

  const handleTogglePublish = async (videoId) => {
    setActionMessage("");
    try {
      await togglePublishStatus(videoId);
      setActionMessage("Publish status updated.");
      loadVideos();
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to update status.");
    }
  };

  const handleEdit = async (video) => {
    const newTitle = window.prompt("Update title", video.title);
    if (newTitle === null) return;
    const newDescription = window.prompt("Update description", video.description || "");
    if (newDescription === null) return;
    setActionMessage("");
    try {
      await updateVideo(video._id, { title: newTitle, description: newDescription });
      setActionMessage("Video updated.");
      loadVideos();
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to update video.");
    }
  };

  const handleDelete = async (videoId) => {
    const confirmed = window.confirm("Delete this video?");
    if (!confirmed) return;
    setActionMessage("");
    try {
      await deleteVideo(videoId);
      setActionMessage("Video deleted.");
      loadVideos();
    } catch (error) {
      setActionMessage(error?.response?.data?.message || "Unable to delete video.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Channel overview</h1>
        <p className="mt-2 text-sm text-slate-400">Track your performance at a glance.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-500">Subscribers</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCompactNumber(stats?.totalSubscribers || 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-500">Total videos</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCompactNumber(stats?.totalVideos || 0)}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-500">Total views</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCompactNumber(stats?.totalViews || 0)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h2 className="text-lg font-semibold">Your videos</h2>
        {actionMessage && <p className="mt-2 text-sm text-slate-400">{actionMessage}</p>}
        <div className="mt-4 space-y-4">
          {videos.map((video) => (
            <div key={video._id} className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
              <img src={video.thumbnail} alt={video.title} className="h-16 w-28 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{video.title}</p>
                <p className="text-xs text-slate-500">{formatCompactNumber(video.views || 0)} views</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                  {video.isPublished ? "Published" : "Draft"}
                </span>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(video._id)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
                >
                  Toggle
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(video)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(video._id)}
                  className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:border-rose-400"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
