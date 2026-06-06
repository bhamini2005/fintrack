import api from "./api";

export const getAnalytics = async () => {
  return await api.get("/analytics");
};