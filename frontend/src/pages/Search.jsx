import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getVideos } from "../services/videoService.js";
import { searchUsers } from "../services/userService.js";
import VideoCard from "../components/cards/VideoCard.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

const Search = () => {
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const sortByParam = params.get("sortBy") || "createdAt";
  const sortTypeParam = params.get("sortType") || "desc";
  const [videos, setVideos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(query);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [sortType, setSortType] = useState(sortTypeParam);
  const [activeTab, setActiveTab] = useState("all");
  const [uploadDate, setUploadDate] = useState("any");
  const [durationFilter, setDurationFilter] = useState("any");

  const recentSearches = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("vv_recent_searches") || "[]");
    } catch {
      return [];
    }
  }, [query]);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      try {
        const [videosResponse, channelsResponse] = await Promise.all([
          getVideos({
            query,
            page: 1,
            limit: 24,
            sortBy,
            sortType
          }),
          searchUsers(query, 8)
        ]);
        setVideos(videosResponse?.data?.docs || []);
        setChannels(channelsResponse?.data || []);
      } catch (error) {
        setVideos([]);
        setChannels([]);
      } finally {
        setLoading(false);
      }
    };

    if (query.trim()) {
      loadResults();
    } else {
      setVideos([]);
      setChannels([]);
      setLoading(false);
    }
  }, [query, sortBy, sortType]);

  const persistRecentSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const existing = recentSearches.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
    const updated = [trimmed, ...existing].slice(0, 6);
    localStorage.setItem("vv_recent_searches", JSON.stringify(updated));
  };

  const handleSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    persistRecentSearch(trimmed);
    setParams({ q: trimmed, sortBy, sortType });
  };

  const handleQuickSort = (nextSortBy, nextSortType) => {
    setSortBy(nextSortBy);
    setSortType(nextSortType);
    if (query.trim()) {
      setParams({ q: query, sortBy: nextSortBy, sortType: nextSortType });
    }
  };

  const filteredVideos = useMemo(() => {
    let filtered = [...videos];

    if (uploadDate !== "any") {
      const now = new Date();
      const ranges = {
        hour: 60 * 60 * 1000,
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000
      };
      const diff = ranges[uploadDate];
      filtered = filtered.filter((video) => {
        if (!video.createdAt || !diff) return true;
        return now - new Date(video.createdAt) <= diff;
      });
    }

    if (durationFilter !== "any") {
      filtered = filtered.filter((video) => {
        const duration = Number(video.duration || 0);
        if (durationFilter === "short") return duration > 0 && duration < 240;
        if (durationFilter === "medium") return duration >= 240 && duration <= 1200;
        if (durationFilter === "long") return duration > 1200;
        return true;
      });
    }

    return filtered;
  }, [videos, uploadDate, durationFilter]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">Search results</h1>
          <p className="mt-2 text-sm text-slate-400">Showing results for “{query || "all videos"}”.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch(inputValue);
          }}
          className="flex flex-wrap gap-3"
        >
          <div className="flex-1 min-w-[220px]">
            <Input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Search videos by title"
            />
          </div>
          <Button type="submit">Search</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setInputValue("");
              setParams({});
            }}
          >
            Clear
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickSort("createdAt", "desc")}
            className={`rounded-full border px-3 py-1 transition ${
              sortBy === "createdAt" && sortType === "desc"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Latest
          </button>
          <button
            type="button"
            onClick={() => handleQuickSort("views", "desc")}
            className={`rounded-full border px-3 py-1 transition ${
              sortBy === "views" && sortType === "desc"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Most viewed
          </button>
          <button
            type="button"
            onClick={() => handleQuickSort("title", "asc")}
            className={`rounded-full border px-3 py-1 transition ${
              sortBy === "title" && sortType === "asc"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            A → Z
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-full border px-3 py-1 transition ${
              activeTab === "all"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("videos")}
            className={`rounded-full border px-3 py-1 transition ${
              activeTab === "videos"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Videos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("channels")}
            className={`rounded-full border px-3 py-1 transition ${
              activeTab === "channels"
                ? "border-brand-400 text-brand-200"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            Channels
          </button>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <select
            value={uploadDate}
            onChange={(event) => setUploadDate(event.target.value)}
            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
          >
            <option value="any">Upload date</option>
            <option value="hour">Last hour</option>
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
          </select>
          <select
            value={durationFilter}
            onChange={(event) => setDurationFilter(event.target.value)}
            className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-200"
          >
            <option value="any">Duration</option>
            <option value="short">Short (&lt; 4 min)</option>
            <option value="medium">Medium (4-20 min)</option>
            <option value="long">Long (&gt; 20 min)</option>
          </select>
        </div>

        {!!recentSearches.length && !query && (
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Recent searches</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSearch(item)}
                  className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-slate-500"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-72 rounded-2xl border border-slate-900 bg-slate-900/50" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {(activeTab === "all" || activeTab === "channels") && !!channels.length && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Channels</h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {channels.map((channel) => (
                  <a
                    key={channel._id}
                    href={`/channel/${channel.username}`}
                    className="flex items-center gap-4 rounded-2xl border border-slate-900 bg-slate-900/60 p-4 transition hover:border-slate-700"
                  >
                    <img
                      src={channel.avatar}
                      alt={channel.fullname}
                      className="h-12 w-12 rounded-full border border-slate-800 object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{channel.fullname}</p>
                      <p className="text-xs text-slate-500">@{channel.username}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {(activeTab === "all" || activeTab === "videos") && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredVideos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
              {!filteredVideos.length && <p className="text-sm text-slate-500">No results found.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
