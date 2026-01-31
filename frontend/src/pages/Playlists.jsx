import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { createPlaylist, getUserPlaylists } from "../services/playlistService.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [status, setStatus] = useState("");

  const loadPlaylists = async () => {
    if (!user) return;
    try {
      const response = await getUserPlaylists(user._id);
      setPlaylists(response?.data || []);
    } catch (error) {
      setPlaylists([]);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [user]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setStatus("");
    try {
      await createPlaylist(form);
      setForm({ name: "", description: "" });
      setStatus("Playlist created.");
      loadPlaylists();
    } catch (error) {
      setStatus(error?.response?.data?.message || "Unable to create playlist.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-900 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-semibold">Playlists</h1>
        <p className="mt-2 text-sm text-slate-400">Organize your content into collections.</p>
        <form onSubmit={handleCreate} className="mt-6 grid gap-3 md:grid-cols-[1fr,1.5fr,auto]">
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Playlist name"
          />
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description"
          />
          <Button type="submit">Create playlist</Button>
        </form>
        {status && <p className="mt-3 text-sm text-slate-400">{status}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {playlists.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlists/${playlist._id}`}
            className="rounded-2xl border border-slate-900 bg-slate-900/60 p-6 text-left transition hover:border-slate-700"
          >
            <p className="text-sm font-semibold text-white">{playlist.name}</p>
            <p className="mt-2 text-xs text-slate-500">{playlist.description}</p>
            <p className="mt-3 text-xs text-slate-600">{playlist.videos?.length || 0} videos</p>
          </Link>
        ))}
        {!playlists.length && <p className="text-sm text-slate-500">No playlists yet.</p>}
      </div>
    </div>
  );
};

export default Playlists;
