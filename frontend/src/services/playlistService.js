import api from "./api.js";

export const getUserPlaylists = async (userId) => {
  const { data } = await api.get(`/playlist/user/${userId}`);
  return data;
};

export const createPlaylist = async (payload) => {
  const { data } = await api.post("/playlist", payload);
  return data;
};

export const addVideoToPlaylist = async (videoId, playlistId) => {
  const { data } = await api.patch(`/playlist/add/${videoId}/${playlistId}`);
  return data;
};

export const getPlaylistById = async (playlistId) => {
  const { data } = await api.get(`/playlist/${playlistId}`);
  return data;
};

export const updatePlaylist = async (playlistId, payload) => {
  const { data } = await api.patch(`/playlist/${playlistId}`, payload);
  return data;
};

export const deletePlaylist = async (playlistId) => {
  const { data } = await api.delete(`/playlist/${playlistId}`);
  return data;
};

export const removeVideoFromPlaylist = async (videoId, playlistId) => {
  const { data } = await api.patch(`/playlist/remove/${videoId}/${playlistId}`);
  return data;
};
