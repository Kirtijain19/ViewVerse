import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService.js";
import { setAuthToken } from "../services/api.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response?.data || null);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (payload) => {
    const response = await authService.login(payload);
    const token = response?.data?.accessToken;
    if (token) {
      setAuthToken(token);
    }
    setUser(response?.data?.user || null);
    return response;
  };

  const register = async (formData) => {
    const response = await authService.register(formData);
    return response;
  };

  const logout = async () => {
    await authService.logout();
    setAuthToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh: loadUser }),
    [user, loading, loadUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);
