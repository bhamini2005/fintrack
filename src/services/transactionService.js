import api from "./api";

export const getTransactions = (params) =>
  api.get("/transactions", {
    params,
  });

export const deleteTransaction = (id) =>
  api.delete(`/transactions/${id}`);

export const updateTransaction = (id, data) =>
  api.put(`/transactions/${id}`, data);