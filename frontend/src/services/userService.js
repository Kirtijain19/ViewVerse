import { API_BASE, STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
	getUserProfile: async (userId) => {
		const res = await fetch(`${API_BASE}/users/${userId}`, {
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to fetch user profile');
		return res.json();
	},
	getCurrentUser: async () => {
		// try to get from backend; fallback to localStorage
		const stored = localStorage.getItem(STORAGE_USER_KEY);
		if (stored) return { data: JSON.parse(stored) };
		const res = await fetch(`${API_BASE}/users/me`, {
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to fetch current user');
		return res.json();
	},
	updateProfile: async (formData) => {
		const res = await fetch(`${API_BASE}/users/me`, {
			method: 'PATCH',
			headers: { ...getAuthHeaders() },
			body: formData,
		});
		if (!res.ok) throw new Error('Failed to update profile');
		return res.json();
	},
};

export default userService;
