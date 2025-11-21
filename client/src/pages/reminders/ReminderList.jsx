// src/pages/reminders/RemindersList.jsx
import React, { useEffect, useState } from "react";
import ReminderCard from "../../components/reminders/ReminderCard";
import SnoozeModal from "../../components/reminders/SnoozeModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Spinner from "../../components/common/Spinner";
import Input from "../../components/common/Input";
import { remindersAPI } from "../../api/reminders";

/**
 * Reminders list page
 * - shows all reminders (for the user)
 * - search by subscription name
 * - edit (opens edit screen or console for now)
 * - snooze (opens SnoozeModal)
 * - delete with confirm
 */
export default function RemindersList() {
  const [loading, setLoading] = useState(true);
  const [reminders, setReminders] = useState([]);
  const [q, setQ] = useState("");
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const [snoozeTarget, setSnoozeTarget] = useState(null);
  const [snoozeValue, setSnoozeValue] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await remindersAPI.getAllReminders();
      // Normalize: maybe res is { reminders: [...] } or array
      const list = Array.isArray(res) ? res : (res.reminders || res.data || []);
      setReminders(list);
    } catch (err) {
      console.error("Failed to load reminders", err);
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  // search/filter
  const filtered = reminders.filter((r) => {
    if (!q) return true;
    const s = q.toLowerCase();
    const name = (r.subscriptionName || r.subscription?.name || "").toString().toLowerCase();
    return name.includes(s);
  });

  // open snooze modal
  function openSnooze(rem) {
    setSnoozeTarget(rem);
    setSnoozeValue(""); // default empty
    setSnoozeOpen(true);
  }

  async function handleSnoozeSave() {
    if (!snoozeTarget) return;
    try {
      await remindersAPI.snoozeReminder(snoozeTarget.subscriptionId || snoozeTarget._id, {
        snoozeDateTime: snoozeValue,
      });
      setSnoozeOpen(false);
      setSnoozeTarget(null);
      await load();
    } catch (err) {
      console.error("Snooze failed", err);
      alert("Failed to snooze reminder");
    }
  }

  function openDelete(rem) {
    setDeleteTarget(rem);
    setConfirmOpen(true);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    try {
      await remindersAPI.deleteReminder(deleteTarget.subscriptionId || deleteTarget._id);
      setConfirmOpen(false);
      setDeleteTarget(null);
      await load();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete reminder");
    }
  }

  if (loading) return <div className="p-8"><Spinner /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Reminders</h1>
        <div className="w-72">
          <Input placeholder="Search subscriptions..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {error && <div className="text-red-600 text-sm">{error}</div>}

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-500">No reminders found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((r) => (
            <ReminderCard
              key={r.subscriptionId || r._id || r.id}
              reminder={{
                ...r,
                subscriptionName: r.subscriptionName || r.subscription?.name || "Subscription",
                enabled: r.isEnabled ?? r.status !== "disabled",
                daysBefore: r.reminderDaysBefore ?? r.reminderDaysBefore,
                snooze: r.snoozeUntil ? new Date(r.snoozeUntil).toLocaleString() : "none",
                repeat: r.renewalFrequencyLabel || r.billingCycle || "custom",
              }}
              onEdit={(rem) => {
                // For now open settings page or console
                // In the future navigate to /subscriptions/:id/reminder
                console.log("Edit reminder", rem);
                // you may route to ReminderSettings page with react-router
              }}
              onDelete={(rem) => openDelete(rem)}
            />
          ))}
        </div>
      )}

      {/* Snooze Modal */}
      <SnoozeModal
        open={snoozeOpen}
        onClose={() => setSnoozeOpen(false)}
        value={snoozeValue}
        setValue={setSnoozeValue}
        onSave={handleSnoozeSave}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete reminder"
        message={`Delete reminder for "${deleteTarget?.subscriptionName || deleteTarget?.subscription?.name || ""}"?`}
      />
    </div>
  );
}
