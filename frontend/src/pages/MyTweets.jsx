import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import { deleteTweet, getUserTweets, updateTweet } from "../services/tweetService.js";

const MyTweets = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [status, setStatus] = useState("");

  const loadTweets = async () => {
    if (!user) return;
    try {
      const response = await getUserTweets(user._id);
      setTweets(response?.data?.docs || []);
    } catch (error) {
      setTweets([]);
    }
  };

  useEffect(() => {
    loadTweets();
  }, [user]);

  const handleEdit = async (tweet) => {
    const newContent = window.prompt("Edit tweet", tweet.content);
    if (newContent === null) return;
    setStatus("");
    try {
      await updateTweet(tweet._id, { newcontent: newContent });
      setStatus("Tweet updated.");
      loadTweets();
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to update tweet.");
    }
  };

  const handleDelete = async (tweetId) => {
    const confirmed = window.confirm("Delete this tweet?");
    if (!confirmed) return;
    setStatus("");
    try {
      await deleteTweet(tweetId);
      setStatus("Tweet deleted.");
      loadTweets();
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to delete tweet.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">My tweets</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your tweets.</p>
        {status && <p className="mt-3 text-sm text-slate-400">{status}</p>}
      </div>

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <div key={tweet._id} className="rounded-2xl border border-slate-900 bg-slate-900/60 p-4">
            <p className="text-sm text-slate-100">{tweet.content}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleEdit(tweet)}
                className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(tweet._id)}
                className="rounded-full border border-rose-500/40 px-3 py-1 text-xs text-rose-300 hover:border-rose-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!tweets.length && <p className="text-sm text-slate-500">No tweets yet.</p>}
      </div>
    </div>
  );
};

export default MyTweets;
