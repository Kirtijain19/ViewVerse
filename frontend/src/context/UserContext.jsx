import React, { createContext, useEffect, useState } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      // try to hydrate user if token exists
      refreshUser().catch(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await authService.login(credentials);
      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user || {}));
        setToken(res.token);
        setUser(res.user || null);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const res = await authService.register(payload);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await userService.getCurrentUser();
      setUser(res.data || res);
      if (res.data) localStorage.setItem('user', JSON.stringify(res.data));
      return res;
    } catch (err) {
      setUser(null);
      throw err;
    }
  };

  const updateUser = (u) => {
    setUser(u);
    if (u) localStorage.setItem('user', JSON.stringify(u));
  };

  return (
    <UserContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        register,
        logout,
        refreshUser,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;