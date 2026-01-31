import api from "./api.js";

export const getChannelStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};
