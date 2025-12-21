import { API_BASE, STORAGE_TOKEN_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const commentService = {
	getVideoComments: async (videoId) => {
		const res = await fetch(`${API_BASE}/comments/${videoId}`, {
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to fetch comments');
		return res.json();
	},
	createComment: async (videoId, content) => {
		const res = await fetch(`${API_BASE}/comments/${videoId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify({ content }),
		});
		if (!res.ok) throw new Error('Failed to create comment');
		return res.json();
	},
	deleteComment: async (commentId) => {
		const res = await fetch(`${API_BASE}/comments/c/${commentId}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to delete comment');
		return res.json();
	},
	updateComment: async (commentId, content) => {
		const res = await fetch(`${API_BASE}/comments/c/${commentId}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
			body: JSON.stringify({ content }),
		});
		if (!res.ok) throw new Error('Failed to update comment');
		return res.json();
	},
};

export default commentService;
