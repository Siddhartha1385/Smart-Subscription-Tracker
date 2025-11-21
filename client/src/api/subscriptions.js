// src/api/subscriptions.js
import api from "./axios";

// GET /api/subscriptions
export const getSubscriptions = async () => {
  const res = await api.get("/subscriptions");
  return res.data; // array of subscriptions
};

// GET /api/subscriptions/:id
export const getSubscriptionById = async (id) => {
  const res = await api.get(`/subscriptions/${id}`);
  return res.data;
};

// POST /api/subscriptions
export const createSubscription = async (payload) => {
  const res = await api.post("/subscriptions", payload);
  return res.data;
};

// PUT /api/subscriptions/:id
export const updateSubscription = async (id, payload) => {
  const res = await api.put(`/subscriptions/${id}`, payload);
  return res.data;
};

// DELETE /api/subscriptions/:id
export const deleteSubscription = async (id) => {
  const res = await api.delete(`/subscriptions/${id}`);
  return res.data;
};

// POST /api/subscriptions/:id/renew
export const renewSubscription = async (id) => {
  const res = await api.post(`/subscriptions/${id}/renew`);
  return res.data;
};
