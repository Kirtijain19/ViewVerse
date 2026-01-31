import api from "./api.js";

export const getUserById = async (userId) => {
  const { data } = await api.get(`/users/${userId}`);
  return data;
};

export const updateAccountDetails = async (payload) => {
  const { data } = await api.patch("/users/update-account", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.post("/users/change-password", payload);
  return data;
};

export const updateAvatar = async (formData) => {
  const { data } = await api.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const updateCoverImage = async (formData) => {
  const { data } = await api.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const getUserChannelProfile = async (username) => {
  const { data } = await api.get(`/users/c/${username}`);
  return data;
};

export const getWatchHistory = async () => {
  const { data } = await api.get("/users/history");
  return data;
};

export const searchUsers = async (query, limit = 8) => {
  const { data } = await api.get("/users/search", { params: { q: query, limit } });
  return data;
};
