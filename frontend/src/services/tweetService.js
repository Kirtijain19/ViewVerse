import { API_BASE, STORAGE_TOKEN_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const tweetService = {
	createTweet: async (content) => {
		const res = await fetch(`${API_BASE}/tweets`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify({ content }),
		});
		if (!res.ok) throw new Error('Failed to create tweet');
		return res.json();
	},
	deleteTweet: async (tweetId) => {
		const res = await fetch(`${API_BASE}/tweets/${tweetId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to delete tweet');
		return res.json();
	},
	updateTweet: async (tweetId, content) => {
		const res = await fetch(`${API_BASE}/tweets/${tweetId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify({ content }),
		});
		if (!res.ok) throw new Error('Failed to update tweet');
		return res.json();
	},
};

export default tweetService;
