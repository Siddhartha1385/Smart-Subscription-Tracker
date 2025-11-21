import React from "react";
import { FiEdit2, FiTrash2, FiClock, FiBellOff, FiBell } from "react-icons/fi";
import formatDate from "../../utils/formatDate";

export default function ReminderCard({ reminder, onEdit, onDelete }) {
  // Safely access nested subscription data
  const subName = reminder.subscriptionId?.name || reminder.subscriptionName || "Unknown Subscription";
  const isEnabled = reminder.isEnabled;

  return (
    <div className="bg-slate-800/60 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-5 hover:border-sky-500/50 transition duration-300">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-slate-100 truncate max-w-[180px]">
            {subName}
          </h3>
          <div className={`flex items-center gap-1 text-xs mt-1 font-medium ${
            isEnabled ? "text-emerald-400" : "text-slate-500"
          }`}>
            {isEnabled ? <FiBell size={12} /> : <FiBellOff size={12} />}
            {isEnabled ? "Active" : "Disabled"}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(reminder)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-sky-500/20 hover:text-sky-400 text-slate-400 transition"
            title="Settings"
          >
            <FiEdit2 size={16} />
          </button>

          <button
            onClick={() => onDelete(reminder)}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 text-slate-400 transition"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-slate-300 text-sm">
          <FiClock className="text-sky-400" />
          <span>
            Notify <strong>{reminder.reminderDaysBefore}</strong> days before
          </span>
        </div>
        
        {reminder.lastReminderSent && (
           <p className="text-xs text-slate-500 ml-6">
             Last sent: {formatDate(reminder.lastReminderSent)}
           </p>
        )}

        {reminder.snoozeUntil && (
           <p className="text-xs text-orange-400 ml-6 font-medium">
             💤 Snoozed until: {formatDate(reminder.snoozeUntil)}
           </p>
        )}
      </div>
    </div>
  );
}