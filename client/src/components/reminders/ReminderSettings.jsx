// src/pages/reminders/ReminderSettings.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

import ReminderForm from "../../components/reminders/ReminderForm";
import SnoozeModal from "../../components/reminders/SnoozeModal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

import { remindersAPI } from "../../api/reminders";
import formatDate from "../../utils/formatDate";

/**
 * ReminderSettings page
 * Route: /subscriptions/:id/reminder  (id = subscriptionId)
 *
 * Assumes remindersAPI.getReminder(subscriptionId) returns a reminder object:
 * {
 *   subscriptionId,
 *   subscriptionName,
 *   isEnabled,
 *   reminderDaysBefore,
 *   reminderTime,        // "HH:MM" or null
 *   userTimezone,        // "Asia/Kolkata" etc
 *   snoozeUntil,         // ISO string or null
 *   lastReminderSent,    // ISO or null
 *   subscription: { renewalDate: ISOString, ... } (optional)
 * }
 */

export default function ReminderSettings() {
  const { id } = useParams(); // subscriptionId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [reminder, setReminder] = useState(null);

  // Snooze modal state
  const [showSnooze, setShowSnooze] = useState(false);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const res = await remindersAPI.getReminder(id);
        if (!mounted) return;
        // normalize values
        setReminder({
          subscriptionId: res.subscriptionId ?? res._id ?? id,
          subscriptionName: res.subscriptionName ?? res.subscription?.name ?? "Subscription",
          isEnabled: res.isEnabled ?? (res.status !== "disabled"),
          reminderDaysBefore: typeof res.reminderDaysBefore !== "undefined" ? Number(res.reminderDaysBefore) : 1,
          reminderTime: res.reminderTime ?? null,
          userTimezone: res.userTimezone ?? "Asia/Kolkata",
          snoozeUntil: res.snoozeUntil ?? null,
          lastReminderSent: res.lastReminderSent ?? null,
          renewalDate: res.subscription?.renewalDate ?? res.renewalDate ?? null,
          raw: res,
        });
      } catch (err) {
        console.error("Failed to load reminder", err);
        alert("Failed to load reminder settings.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  // compute preview of next trigger (best-effort)
  const nextTriggerPreview = useMemo(() => {
    if (!reminder) return null;
    const { renewalDate, reminderDaysBefore, reminderTime, userTimezone, snoozeUntil } = reminder;

    // If snoozed, that takes precedence
    if (snoozeUntil) {
      try {
        const d = new Date(snoozeUntil);
        if (!isNaN(d)) return d;
      } catch (e) {}
    }

    if (!renewalDate) return null;
    try {
      // get renewal date base (date-only)
      const base = new Date(renewalDate);
      if (isNaN(base)) return null;

      // subtract daysBefore
      const target = new Date(base.getTime() - (Number(reminderDaysBefore || 0) * 24 * 60 * 60 * 1000));

      // if reminderTime provided (HH:MM), set hours/minutes (in local timezone)
      if (reminderTime && typeof reminderTime === "string") {
        const [hStr, mStr] = reminderTime.split(":");
        const h = Number(hStr || 9);
        const m = Number(mStr || 0);
        target.setHours(h, m, 0, 0);
      } else {
        // default 09:00 local
        target.setHours(9, 0, 0, 0);
      }

      return target;
    } catch (e) {
      return null;
    }
  }, [reminder]);

  // handle changes locally in form-like way
  function handleChange(newValues) {
    setReminder((prev) => ({ ...prev, ...newValues }));
  }

  async function handleSave(e) {
    e?.preventDefault?.();
    if (!reminder) return;
    try {
      setSaving(true);
      const payload = {
        isEnabled: reminder.isEnabled,
        reminderDaysBefore: Number(reminder.reminderDaysBefore),
        reminderTime: reminder.reminderTime,
        userTimezone: reminder.userTimezone,
      };
      await remindersAPI.updateReminder(reminder.subscriptionId, payload);
      alert("Reminder settings saved.");
      // refresh
      const refreshed = await remindersAPI.getReminder(reminder.subscriptionId);
      setReminder((prev) => ({ ...prev, ...{
        snoozeUntil: refreshed.snoozeUntil ?? prev.snoozeUntil,
        lastReminderSent: refreshed.lastReminderSent ?? prev.lastReminderSent
      }}));
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSnoozeSubmit(dateTimeString) {
    if (!reminder) return;
    try {
      await remindersAPI.snoozeReminder(reminder.subscriptionId, { snoozeDateTime: dateTimeString });
      // refresh
      const refreshed = await remindersAPI.getReminder(reminder.subscriptionId);
      setReminder((prev) => ({ ...prev, snoozeUntil: refreshed.snoozeUntil ?? null }));
      setShowSnooze(false);
      alert("Reminder snoozed.");
    } catch (err) {
      console.error("Snooze failed", err);
      alert("Failed to snooze.");
    }
  }

  async function handleDelete() {
    if (!reminder) return;
    try {
      await remindersAPI.deleteReminder(reminder.subscriptionId);
      alert("Reminder deleted.");
      navigate("/reminders");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete reminder.");
    }
  }

  if (loading) {
    return <div className="p-8"><Spinner /></div>;
  }

  if (!reminder) {
    return (
      <div className="p-8 text-center text-gray-600">
        Reminder not found.
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Reminder Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Subscription: <strong>{reminder.subscriptionName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Form */}
      <ReminderForm
        values={{
          isEnabled: reminder.isEnabled,
          reminderDaysBefore: reminder.reminderDaysBefore,
          reminderTime: reminder.reminderTime,
          userTimezone: reminder.userTimezone,
        }}
        onChange={(vals) => handleChange(vals)}
        onSubmit={handleSave}
        loading={saving}
      />

      {/* Preview & Snooze */}
      <div className="bg-white p-5 rounded-xl shadow-sm border space-y-3">
        <h3 className="font-semibold text-gray-700">Preview & Quick Actions</h3>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-800">Next trigger: </span>
              {nextTriggerPreview ? (
                <span>{formatDate(nextTriggerPreview)}</span>
              ) : (
                <span className="text-gray-500">Not available</span>
              )}
            </div>

            <div className="mt-2">
              <span className="font-medium text-gray-800">Last sent: </span>
              {reminder.lastReminderSent ? (
                <span>{formatDate(reminder.lastReminderSent)}</span>
              ) : (
                <span className="text-gray-500">Never</span>
              )}
            </div>

            {reminder.snoozeUntil && (
              <div className="mt-2 text-sm text-orange-600">
                Snoozed until: {formatDate(reminder.snoozeUntil)}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setShowSnooze(true)}>Snooze</Button>
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>Delete Reminder</Button>
          </div>
        </div>
      </div>

      {/* Snooze Modal */}
      <SnoozeModal
        open={showSnooze}
        onClose={() => setShowSnooze(false)}
        onSubmit={handleSnoozeSubmit}
      />

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete reminder"
        message={`Delete reminder for "${reminder.subscriptionName}"? This action cannot be undone.`}
      />
    </div>
  );
}
