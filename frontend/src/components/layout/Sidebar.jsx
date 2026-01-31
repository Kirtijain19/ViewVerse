import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, ListVideo, ThumbsUp, UploadCloud, Clock, Settings, Users, MessageSquare } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.js";

const baseLinks = [{ to: "/", label: "Home", icon: Home }];

const authLinks = [
  { to: "/studio", label: "Studio", icon: LayoutGrid },
  { to: "/upload", label: "Upload", icon: UploadCloud },
  { to: "/playlists", label: "Playlists", icon: ListVideo },
  { to: "/liked", label: "Liked", icon: ThumbsUp },
  { to: "/history", label: "History", icon: Clock },
  { to: "/tweets", label: "Tweets", icon: MessageSquare },
  { to: "/subscriptions", label: "Subscriptions", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings }
];

const Sidebar = () => {
  const { user } = useAuth();
  const navLinks = user ? [...baseLinks, ...authLinks] : baseLinks;
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-900 bg-slate-950 px-4 py-6 lg:block">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Browse</p>
      <nav className="mt-6 flex flex-col gap-2">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-900/60"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm font-semibold text-slate-100">Creator tips</p>
          <p className="mt-2 text-xs text-slate-400">
            Upload consistently, optimize your thumbnails, and engage with comments to grow faster.
          </p>
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm font-semibold text-slate-100">Sign in to create</p>
          <p className="mt-2 text-xs text-slate-400">
            Log in to upload videos, manage playlists, and view your studio analytics.
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
