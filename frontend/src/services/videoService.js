import api from "./api.js";

export const getVideos = async (params = {}) => {
  const { data } = await api.get("/videos", { params });
  return data;
};

export const getVideoById = async (videoId) => {
  const { data } = await api.get(`/videos/${videoId}`);
  return data;
};

export const publishVideo = async (formData) => {
  const { data } = await api.post("/videos", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
};

export const getChannelVideos = async () => {
  const { data } = await api.get("/dashboard/videos");
  return data;
};

export const updateVideo = async (videoId, payload) => {
  const { data } = await api.patch(`/videos/${videoId}`, payload, {
    headers: payload instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined
  });
  return data;
};

export const deleteVideo = async (videoId) => {
  const { data } = await api.delete(`/videos/${videoId}`);
  return data;
};

export const togglePublishStatus = async (videoId) => {
  const { data } = await api.patch(`/videos/toggle/publish/${videoId}`);
  return data;
};
