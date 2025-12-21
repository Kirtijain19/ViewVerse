import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlaylistCard from '../components/playlist/PlaylistCard';
import Sidebar from '../components/common/Sidebar';
import { API_BASE } from '../utils/constants';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/playlists/${id}`);
      if (!res.ok) throw new Error('Failed to load playlist');
      const data = await res.json();
      setPlaylist(data.data || data);
      setError('');
    } catch (err) {
      setError(err.message || 'Error loading playlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 20 }}>
          {loading && <p>Loading playlist...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {playlist && (
            <>
              <h2>{playlist.name}</h2>
              <p>{playlist.description}</p>

              <div style={{ display: 'grid', gap: 12 }}>
                {(playlist.videos || []).map((v) => (
                  <PlaylistCard key={v._id || v.id} playlist={{ ...playlist, videos: [v] }} />
                ))}
                {playlist.videos.length === 0 && <p>No videos in this playlist.</p>}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Playlist;