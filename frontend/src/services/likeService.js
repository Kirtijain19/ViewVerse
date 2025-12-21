import { API_BASE, STORAGE_TOKEN_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

async function toggleVideoLike(videoId) {
	const res = await fetch(`${API_BASE}/likes/toggle/v/${videoId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...getAuthHeaders(),
		},
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.message || 'Failed to toggle like');
	}

	return res.json();
}

const likeService = {
	likeVideo: (id) => toggleVideoLike(id),
	unlikeVideo: (id) => toggleVideoLike(id), // backend toggles like/unlike on the same endpoint
};

export default likeService;
