import { useEffect, useState } from "react";
import { getWatchHistory } from "../services/userService.js";
import { Link } from "react-router-dom";

const History = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await getWatchHistory();
        setVideos(response?.data || []);
      } catch (error) {
        setVideos([]);
      }
    };

    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Watch history</h1>
        <p className="mt-2 text-sm text-slate-400">Videos you recently watched.</p>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Link
            key={video._id}
            to={`/watch/${video._id}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-900 bg-slate-900/60 p-4 transition hover:border-slate-700"
          >
            <img src={video.thumbnail} alt={video.title} className="h-20 w-36 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">{video.title}</p>
              <p className="mt-1 text-xs text-slate-500">{Math.ceil(video.duration || 0)}s</p>
            </div>
          </Link>
        ))}
        {!videos.length && <p className="text-sm text-slate-500">No history yet.</p>}
      </div>
    </div>
  );
};

export default History;
