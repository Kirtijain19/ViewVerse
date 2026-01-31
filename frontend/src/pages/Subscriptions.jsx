import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { getSubscribedChannels, getUserChannelSubscribers } from "../services/subscriptionService.js";

const Subscriptions = () => {
  const { user } = useAuth();
  const [subscribed, setSubscribed] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      try {
        const channelsResponse = await getSubscribedChannels(user._id);
        setSubscribed(channelsResponse?.data || []);
      } catch (error) {
        setSubscribed([]);
      }

      try {
        const subscribersResponse = await getUserChannelSubscribers(user._id);
        setSubscribers(subscribersResponse?.data || []);
      } catch (error) {
        setSubscribers([]);
      }
    };

    loadData();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your subscriptions and subscribers.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Channels you follow</h2>
          <div className="mt-4 space-y-3">
            {subscribed?.length ? (
              subscribed.map((item) => (
                <Link
                  key={item._id}
                  to={`/channel/${item.channel?.username}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3 transition hover:border-slate-700"
                >
                  <img
                    src={item.channel?.avatar}
                    alt={item.channel?.fullname}
                    className="h-10 w-10 rounded-full border border-slate-800 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.channel?.fullname}</p>
                    <p className="text-xs text-slate-500">@{item.channel?.username}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">No subscriptions yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Your subscribers</h2>
          <div className="mt-4 space-y-3">
            {subscribers?.length ? (
              subscribers.map((item) => (
                <Link
                  key={item._id}
                  to={`/channel/${item.subscriber?.username}`}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-3 transition hover:border-slate-700"
                >
                  <img
                    src={item.subscriber?.avatar}
                    alt={item.subscriber?.fullname}
                    className="h-10 w-10 rounded-full border border-slate-800 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.subscriber?.fullname}</p>
                    <p className="text-xs text-slate-500">@{item.subscriber?.username}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-slate-500">No subscribers yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
