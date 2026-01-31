import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, UploadCloud, UserCircle2 } from "lucide-react";
import Button from "../ui/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useState } from "react";

const Header = () => {
  const { user, logout } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-900 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-xl bg-brand-500">
            <img src="/logo.svg" alt="ViewVerse" className="h-full w-full" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">ViewVerse</p>
            <p className="text-xs text-slate-400">Creator Studio</p>
          </div>
        </Link>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSearch();
          }}
          className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-400 lg:flex"
        >
          <Search className="h-4 w-4" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creators, videos, playlists..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500"
          />
          <Button size="sm" variant="ghost" className="rounded-lg px-3" type="submit">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink to="/upload">
                <Button size="sm" className="gap-2">
                  <UploadCloud className="h-4 w-4" /> Upload
                </Button>
              </NavLink>
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar}
                  alt={user.fullname}
                  className="h-10 w-10 rounded-full border border-slate-800 object-cover"
                />
                <Button variant="ghost" size="sm" onClick={logout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <NavLink to="/login">
              <Button variant="outline" size="sm" className="gap-2">
                <UserCircle2 className="h-4 w-4" /> Sign in
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
