import { API_BASE, STORAGE_TOKEN_KEY } from '../utils/constants';

const getAuthHeaders = () => {
	const token = localStorage.getItem(STORAGE_TOKEN_KEY);
	return token ? { Authorization: `Bearer ${token}` } : {};
};

const videoService = {
	getAllVideos: async () => {
		const res = await fetch(`${API_BASE}/videos`, {
			headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
		});
		if (!res.ok) throw new Error('Failed to fetch videos');
		return res.json();
	},
	uploadVideo: async (formData) => {
		const res = await fetch(`${API_BASE}/videos`, {
			method: 'POST',
			headers: { ...getAuthHeaders() },
			body: formData,
		});
		if (!res.ok) {
			let errText = '';
			try {
				const data = await res.json();
				errText = data?.message || data?.error || JSON.stringify(data);
			} catch (e) {
				errText = await res.text();
			}
			throw new Error(`Failed to upload video: ${res.status} ${errText}`);
		}
		return res.json();
	},
};

export default videoService;
