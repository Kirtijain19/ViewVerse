import { API_BASE, STORAGE_TOKEN_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const playlistService = {
	getUserPlaylists: async () => {
		const res = await fetch(`${API_BASE}/playlist/`, {
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to fetch playlists');
		return res.json();
	},
	createPlaylist: async (payload) => {
		const res = await fetch(`${API_BASE}/playlist/`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify(payload),
		});
		if (!res.ok) throw new Error('Failed to create playlist');
		return res.json();
	},
	addVideoToPlaylist: async (playlistId, videoId) => {
		const res = await fetch(`${API_BASE}/playlist/${playlistId}/add`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify({ videoId }),
		});
		if (!res.ok) throw new Error('Failed to add video to playlist');
		return res.json();
	},
};

export default playlistService;
