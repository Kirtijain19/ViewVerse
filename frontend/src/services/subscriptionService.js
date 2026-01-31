import api from "./api.js";

export const toggleSubscription = async (channelId) => {
  const { data } = await api.post(`/subscriptions/c/${channelId}`);
  return data;
};

export const getSubscribedChannels = async (subscriberId) => {
  const { data } = await api.get(`/subscriptions/u/${subscriberId}`);
  return data;
};

export const getUserChannelSubscribers = async (subscriberId) => {
  const { data } = await api.get(`/subscriptions/c/${subscriberId}`);
  return data;
};
