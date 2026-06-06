import API from "./api";

// ================= DASHBOARD SUMMARY =================

export const getDashboardSummary = async () => {
  return API.get("/dashboard/summary");
};

// ================= RECENT TRANSACTIONS =================

export const getRecentTransactions = async () => {
  return API.get("/dashboard/recent");
};