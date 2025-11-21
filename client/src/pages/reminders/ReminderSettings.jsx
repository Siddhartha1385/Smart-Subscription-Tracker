import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import SnoozeModal from "../../components/reminders/SnoozeModal";
import {
  getReminderBySubscription,
  updateReminder,
  snoozeReminder,
  enableReminder,
  disableReminder,
} from "../../api/reminders";
// 1. Import the subscription API to get the name
import { getSubscriptionById } from "../../api/subscriptions";

export default function ReminderSettings() {
  const { id } = useParams(); // This is the subscriptionId
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [reminder, setReminder] = useState(null);
  const [subscription, setSubscription] = useState(null); // 2. State for subscription details

  const [form, setForm] = useState({
    reminderDaysBefore: 0,
    reminderTime: "",
    userTimezone: "Asia/Kolkata",
    isEnabled: true,
  });
  const [snoozeOpen, setSnoozeOpen] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    try {
      setLoading(true);

      // 3. Fetch BOTH Reminder and Subscription details
      // We use Promise.allSettled so if one fails, the other might still work
      const [remResult, subResult] = await Promise.allSettled([
        getReminderBySubscription(id),
        getSubscriptionById(id)
      ]);

      // Handle Reminder Data
      if (remResult.status === "fulfilled") {
        const rem = remResult.value;
        setReminder(rem);
        setForm({
          reminderDaysBefore: rem.reminderDaysBefore ?? 1,
          reminderTime: rem.reminderTime || "",
          userTimezone: rem.userTimezone || "Asia/Kolkata",
          isEnabled: rem.isEnabled ?? true,
        });
      }

      // Handle Subscription Data (for the name)
      if (subResult.status === "fulfilled") {
        setSubscription(subResult.value);
      }

    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  }

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function onSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateReminder(id, {
        reminderDaysBefore: Number(form.reminderDaysBefore),
        reminderTime: form.reminderTime || null,
        userTimezone: form.userTimezone,
        isEnabled: form.isEnabled,
      });
      navigate(-1); 
    } catch (err) {
      console.error("Failed to update reminder", err);
      alert("Failed to update reminder.");
    } finally {
      setSaving(false);
    }
  }

  async function onToggleEnabled() {
    try {
      if (form.isEnabled) {
        await disableReminder(id);
        setForm((f) => ({ ...f, isEnabled: false }));
      } else {
        await enableReminder(id);
        setForm((f) => ({ ...f, isEnabled: true }));
      }
      await load();
    } catch (err) {
      console.error("Toggle failed", err);
      alert("Failed to toggle reminder.");
    }
  }

  async function onSnoozeSubmit(datetimeISO) {
    try {
      await snoozeReminder(id, datetimeISO);
      setSnoozeOpen(false);
      await load();
      alert("Reminder snoozed successfully");
    } catch (err) {
      console.error("Snooze failed", err);
      alert("Failed to snooze reminder.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  // 4. Determine Name: Use the fetched subscription object first
  const subName = subscription?.name || reminder?.subscriptionId?.name || "Subscription";

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-50">
            Reminder Settings
          </h1>
          <p className="text-sm text-slate-400">
            For: <span className="text-sky-400 font-medium">{subName}</span>
          </p>
        </div>

        <Button variant="secondary" onClick={() => navigate("/reminders")}>
          View All Reminders
        </Button>
      </div>

      <form
        onSubmit={onSave}
        className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-5 bg-slate-900/50 border border-white/10 rounded-xl"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              label="Days before renewal"
              name="reminderDaysBefore"
              type="number"
              value={form.reminderDaysBefore}
              onChange={onChange}
            />
          </div>

          <div className="flex-1">
            <Input
              label="Preferred time (HH:MM)"
              name="reminderTime"
              type="time"
              value={form.reminderTime}
              onChange={onChange}
            />
          </div>
        </div>

        <Select
          label="Timezone"
          name="userTimezone"
          value={form.userTimezone}
          onChange={onChange}
          options={[
            { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
            { value: "UTC", label: "UTC" },
            { value: "America/New_York", label: "New York (EST)" },
            { value: "Europe/London", label: "London (GMT)" },
          ]}
        />

        <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
          <input
            id="isEnabled"
            name="isEnabled"
            type="checkbox"
            checked={form.isEnabled}
            onChange={onChange}
            className="h-5 w-5 rounded border-slate-500 bg-slate-700 accent-sky-500"
          />
          <label
            htmlFor="isEnabled"
            className="text-sm text-slate-200 select-none cursor-pointer"
          >
            Enable reminder for this subscription
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Settings"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onToggleEnabled}
          >
            {form.isEnabled ? "Disable Reminder" : "Enable Reminder"}
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={() => setSnoozeOpen(true)}
          >
            Snooze
          </Button>
        </div>
      </form>

      <SnoozeModal
        open={snoozeOpen}
        onClose={() => setSnoozeOpen(false)}
        onSubmit={onSnoozeSubmit} 
      />
    </div>
  );
}