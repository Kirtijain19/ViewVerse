import api from "./api.js";

export const getUserTweets = async (userId) => {
  const { data } = await api.get(`/tweets/user/${userId}`);
  return data;
};

export const getAllTweets = async (params = {}) => {
  const { data } = await api.get("/tweets/all", { params });
  return data;
};

export const createTweet = async (payload) => {
  const { data } = await api.post("/tweets", payload);
  return data;
};

export const updateTweet = async (tweetId, payload) => {
  const { data } = await api.patch(`/tweets/${tweetId}`, payload);
  return data;
};

export const deleteTweet = async (tweetId) => {
  const { data } = await api.delete(`/tweets/${tweetId}`);
  return data;
};
