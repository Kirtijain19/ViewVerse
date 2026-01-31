import api from "./api.js";

export const getComments = async (videoId, params = {}) => {
  const { data } = await api.get(`/comments/${videoId}`, { params });
  return data;
};

export const addComment = async (videoId, payload) => {
  const { data } = await api.post(`/comments/${videoId}`, payload);
  return data;
};

export const updateComment = async (commentId, payload) => {
  const { data } = await api.patch(`/comments/c/${commentId}`, payload);
  return data;
};

export const deleteComment = async (commentId) => {
  const { data } = await api.delete(`/comments/c/${commentId}`);
  return data;
};
