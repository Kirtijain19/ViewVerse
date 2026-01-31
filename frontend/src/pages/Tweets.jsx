import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import { createTweet, getAllTweets } from "../services/tweetService.js";
import { toggleTweetLike } from "../services/likeService.js";

const Tweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");

  const loadTweets = async () => {
    try {
      const response = await getAllTweets({ page: 1, limit: 20 });
      setTweets(response?.data?.docs || []);
    } catch (error) {
      setTweets([]);
    }
  };

  useEffect(() => {
    loadTweets();
  }, [user]);

  const handleCreate = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      await createTweet({ content });
      setContent("");
      setStatus("Tweet posted.");
      loadTweets();
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to post tweet.");
    }
  };

  const handleLike = async (tweetId) => {
    setStatus("");
    try {
      await toggleTweetLike(tweetId);
      setStatus("Tweet like updated.");
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to like tweet.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tweets</h1>
          <p className="mt-2 text-sm text-slate-400">Share quick updates with your audience.</p>
        </div>
        <Link to="/my-tweets">
          <Button variant="outline">My tweets</Button>
        </Link>
      </div>

      <form onSubmit={handleCreate} className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6 space-y-3">
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="What's happening?"
          rows={3}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500"
        />
        <Button type="submit">Post tweet</Button>
        {status && <p className="text-sm text-slate-400">{status}</p>}
      </form>

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
            <div className="flex items-center gap-3">
              <img
                src={tweet.owner?.avatar}
                alt={tweet.owner?.fullname}
                className="h-10 w-10 rounded-full border border-slate-800 object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">{tweet.owner?.fullname}</p>
                <p className="text-xs text-slate-500">@{tweet.owner?.username}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-100">{tweet.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleLike(tweet._id)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
              >
                Like
              </button>
            </div>
          </div>
        ))}
        {!tweets.length && <p className="text-sm text-slate-500">No tweets yet.</p>}
      </div>
    </div>
  );
};

export default Tweets;
