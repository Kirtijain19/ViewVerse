import { useEffect, useState } from "react";
import { getLikedVideos } from "../services/likeService.js";
import VideoCard from "../components/cards/VideoCard.jsx";

const Liked = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const loadLiked = async () => {
      try {
        const response = await getLikedVideos();
        const liked = response?.data || [];
        setVideos(liked.map((item) => item.video).filter(Boolean));
      } catch (error) {
        setVideos([]);
      }
    };

    loadLiked();
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Liked videos</h1>
        <p className="mt-2 text-sm text-slate-400">Your favorites, all in one place.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {!videos.length && <p className="text-sm text-slate-500">No liked videos yet.</p>}
      </div>
    </div>
  );
};

export default Liked;
