import api from "./api.js";

export const toggleVideoLike = async (videoId) => {
  const { data } = await api.post(`/likes/toggle/v/${videoId}`);
  return data;
};

export const toggleCommentLike = async (commentId) => {
  const { data } = await api.post(`/likes/toggle/c/${commentId}`);
  return data;
};

export const getLikedVideos = async () => {
  const { data } = await api.get("/likes/videos");
  return data;
};

export const toggleTweetLike = async (tweetId) => {
  const { data } = await api.post(`/likes/toggle/t/${tweetId}`);
  return data;
};
