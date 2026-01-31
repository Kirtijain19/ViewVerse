import api from "./api.js";

export const login = async (payload) => {
  const { data } = await api.post("/users/login", payload);
  return data;
};

export const register = async (formData) => {
  const { data } = await api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const logout = async () => {
  const { data } = await api.post("/users/logout");
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await api.post("/users/current-user");
  return data;
};
