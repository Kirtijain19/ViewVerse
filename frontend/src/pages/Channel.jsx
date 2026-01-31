import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserChannelProfile } from "../services/userService.js";
import { getVideos } from "../services/videoService.js";
import { toggleSubscription } from "../services/subscriptionService.js";
import Button from "../components/ui/Button.jsx";
import { useAuth } from "../hooks/useAuth.js";

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const loadChannel = async () => {
      try {
        const response = await getUserChannelProfile(username);
        setChannel(response?.data || null);
        if (response?.data?._id) {
          const videosResponse = await getVideos({ userId: response.data._id });
          setVideos(videosResponse?.data?.docs || []);
        }
      } catch (error) {
        setChannel(null);
        setVideos([]);
      }
    };

    loadChannel();
  }, [username]);

  const handleSubscribe = async () => {
    if (!channel) return;
    setStatus("");
    try {
      await toggleSubscription(channel._id);
      const refreshed = await getUserChannelProfile(username);
      setChannel(refreshed?.data || channel);
      setStatus("Subscription updated.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to subscribe.");
    }
  };

  if (!channel) {
    return <p className="text-sm text-slate-400">Channel not found.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <div className="flex flex-wrap items-center gap-4">
          <img src={channel.avatar} alt={channel.fullname} className="h-16 w-16 rounded-full border border-slate-800 object-cover" />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-white">{channel.fullname}</h1>
            <p className="text-sm text-slate-400">@{channel.username}</p>
          </div>
          {user && (
            <Button variant="outline" onClick={handleSubscribe}>
              {channel.isSubscribed ? "Subscribed" : "Subscribe"}
            </Button>
          )}
        </div>
        {status && <p className="mt-3 text-sm text-slate-400">{status}</p>}
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
        {!videos.length && <p className="text-sm text-slate-500">No videos yet.</p>}
      </div>
    </div>
  );
};

export default Channel;
