// src/components/reminders/ReminderForm.jsx
import React from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

export default function ReminderForm({
  values,
  onChange,
  onSubmit,
  loading = false,
}) {
  const timezones = [
    { value: "Asia/Kolkata", label: "Asia/Kolkata (IST)" },
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "New York (EST)" },
    { value: "Europe/London", label: "London (GMT)" },
  ];

  const dayOptions = [
    { value: 0, label: "On renewal day" },
    { value: 1, label: "1 day before" },
    { value: 2, label: "2 days before" },
    { value: 3, label: "3 days before" },
    { value: 7, label: "1 week before" },
    { value: 14, label: "2 weeks before" },
  ];

  return (
    <form
      className="space-y-5 bg-white p-5 rounded-xl shadow-sm border"
      onSubmit={onSubmit}
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800">
        Reminder Settings
      </h2>

      {/* Enable / Disable */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">Enable Reminder</span>

        <input
          type="checkbox"
          checked={values.isEnabled}
          onChange={(e) =>
            onChange({ ...values, isEnabled: e.target.checked })
          }
          className="w-5 h-5 accent-indigo-600 cursor-pointer"
        />
      </div>

      {/* Days before */}
      <Select
        label="Notify me before"
        value={values.reminderDaysBefore}
        onChange={(e) =>
          onChange({ ...values, reminderDaysBefore: Number(e.target.value) })
        }
        options={dayOptions}
      />

      {/* Reminder time */}
      <Input
        label="Reminder Time"
        type="time"
        value={values.reminderTime || ""}
        onChange={(e) => onChange({ ...values, reminderTime: e.target.value })}
      />

      {/* Timezone */}
      <Select
        label="Timezone"
        value={values.userTimezone}
        onChange={(e) =>
          onChange({ ...values, userTimezone: e.target.value })
        }
        options={timezones}
      />

      {/* Save Button */}
      <Button type="submit" disabled={loading} className="w-full mt-4">
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
