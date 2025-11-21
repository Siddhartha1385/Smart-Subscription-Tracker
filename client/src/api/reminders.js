import api from "./axios";

// GET /api/reminders -> all reminders for user
export const getAllReminders = async () => {
  const res = await api.get("/reminders");
  return res.data;
};

// GET /api/reminders/:subscriptionId
export const getReminderBySubscription = async (subscriptionId) => {
  const res = await api.get(`/reminders/${subscriptionId}`);
  return res.data;
};

// PUT /api/reminders/:subscriptionId
export const updateReminder = async (subscriptionId, payload) => {
  const res = await api.put(`/reminders/${subscriptionId}`, payload);
  return res.data;
};

// POST /api/reminders/:subscriptionId/snooze
export const snoozeReminder = async (subscriptionId, snoozeDateTime) => {
  const res = await api.post(`/reminders/${subscriptionId}/snooze`, {
    snoozeDateTime,
  });
  return res.data;
};

// POST /api/reminders/:subscriptionId/enable
export const enableReminder = async (subscriptionId) => {
  const res = await api.post(`/reminders/${subscriptionId}/enable`);
  return res.data;
};

// POST /api/reminders/:subscriptionId/disable
export const disableReminder = async (subscriptionId) => {
  const res = await api.post(`/reminders/${subscriptionId}/disable`);
  return res.data;
};

// DELETE /api/reminders/:subscriptionId
// (You were missing this in the API file, but the page used it)
export const deleteReminder = async (subscriptionId) => {
  const res = await api.delete(`/reminders/${subscriptionId}`);
  return res.data;
};