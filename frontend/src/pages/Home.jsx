import { useEffect, useState } from "react";
import VideoCard from "../components/cards/VideoCard.jsx";
import { getVideos } from "../services/videoService.js";
import Badge from "../components/ui/Badge.jsx";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await getVideos({ page: 1, limit: 12 });
        setVideos(response?.data?.docs || []);
      } catch (error) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/60 to-slate-950 p-8">
        <Badge className="bg-brand-500/20 text-brand-200">New</Badge>
        <h1 className="mt-4 text-3xl font-semibold text-white">Welcome to ViewVerse Studio</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Manage your content, upload new videos, and grow your audience with a modern creator toolkit.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Trending uploads</h2>
          <p className="text-sm text-slate-500">Latest updates across the platform</p>
        </div>
        {loading ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-72 rounded-2xl border border-slate-900 bg-slate-900/50" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
