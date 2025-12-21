import { API_BASE, STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from '../utils/constants';

const normalizeLoginResponse = (apiResp) => {
  const data = apiResp?.data || apiResp || {};
  const token = data?.accessToken || data?.token || apiResp?.accessToken || null;
  const user = data?.user || data || null;
  return { token, user, raw: apiResp };
};

const authService = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.message || json?.data?.message || 'Login failed';
      throw new Error(msg);
    }

    const { token, user } = normalizeLoginResponse(json);
    return { token, user, raw: json };
  },

  register: async (payload) => {
    // payload can be FormData (for avatar/cover) or plain object
    const isForm = typeof FormData !== 'undefined' && payload instanceof FormData;
    const res = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: isForm ? {} : { 'Content-Type': 'application/json' },
      body: isForm ? payload : JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = json?.message || json?.data?.message || 'Registration failed';
      throw new Error(msg);
    }
    return json;
  },

  logout: async () => {
    try {
      await fetch(`${API_BASE}/users/logout`, { method: 'POST' });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
  },
};

export default authService;
