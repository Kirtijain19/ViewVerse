import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { formatCompactNumber, formatDuration, formatTimeAgo } from "../../utils/formatters.js";

const VideoCard = ({ video }) => {
  return (
    <Link to={`/watch/${video._id}`} className="group rounded-2xl border border-slate-900 bg-slate-900/50 p-3 transition hover:border-slate-700">
      <div className="relative overflow-hidden rounded-xl">
        <img src={video.thumbnail} alt={video.title} className="h-44 w-full object-cover transition group-hover:scale-105" />
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-slate-900/80 px-2 py-1 text-xs text-slate-200">
          <Clock className="h-3 w-3" /> {formatDuration(video.duration)}
        </span>
      </div>
      <div className="mt-4 flex items-start gap-3">
        <img src={video.owner?.avatar} alt={video.owner?.fullname} className="h-10 w-10 rounded-full border border-slate-800 object-cover" />
        <div>
          <p className="text-sm font-semibold text-white line-clamp-2">{video.title}</p>
          <p className="mt-1 text-xs text-slate-400">{video.owner?.fullname}</p>
          <p className="mt-1 text-xs text-slate-500">
            {formatCompactNumber(video.views || 0)} views • {formatTimeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
