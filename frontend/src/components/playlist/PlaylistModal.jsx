import React, { useState, useEffect } from 'react';
import playlistService from '../../services/playlistService';
import '../../styles/PlaylistModal.css';

const PlaylistModal = ({ videoId, isOpen, onClose, onSuccess }) => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchPlaylists();
    }
  }, [isOpen]);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const data = await playlistService.getUserPlaylists();
      setPlaylists(data.data || []);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaylistToggle = (playlistId) => {
    setSelectedPlaylists(prev => 
      prev.includes(playlistId) 
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    try {
      setCreating(true);
      const response = await playlistService.createPlaylist({
        name: newPlaylistName,
        description: '',
      });
      setPlaylists([...playlists, response.data]);
      setNewPlaylistName('');
    } catch (err) {
      console.error('Failed to create playlist:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleSave = async () => {
    try {
      for (const playlistId of selectedPlaylists) {
        await playlistService.addVideoToPlaylist(playlistId, videoId);
      }
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to add video to playlists:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add to Playlist</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {loading ? (
          <div className="loading">Loading playlists...</div>
        ) : (
          <div className="modal-body">
            <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
              <input 
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="New playlist name"
              />
              <button type="submit" disabled={creating}>
                {creating ? 'Creating...' : 'Create'}
              </button>
            </form>

            <div className="playlists-list">
              {playlists.map(playlist => (
                <div key={playlist._id} className="playlist-item">
                  <input 
                    type="checkbox"
                    id={`playlist-${playlist._id}`}
                    checked={selectedPlaylists.includes(playlist._id)}
                    onChange={() => handlePlaylistToggle(playlist._id)}
                  />
                  <label htmlFor={`playlist-${playlist._id}`}>
                    {playlist.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;