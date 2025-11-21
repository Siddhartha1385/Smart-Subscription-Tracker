import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiBellOff, FiClock, FiSearch, FiSettings } from "react-icons/fi";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";
import { getAllReminders, enableReminder, disableReminder } from "../../api/reminders";
import formatDate from "../../utils/formatDate";

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const res = await getAllReminders();
      // Ensure we always work with an array
      setReminders(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load reminders", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (reminder) => {
    // 1. Optimistic Update (Update UI immediately for speed)
    const newStatus = !reminder.isEnabled;
    setReminders((prev) =>
      prev.map((r) =>
        r._id === reminder._id ? { ...r, isEnabled: newStatus } : r
      )
    );

    try {
      // 2. API Call (Subscription ID is needed for the endpoint)
      const subId = reminder.subscriptionId?._id || reminder.subscriptionId;
      
      if (newStatus) {
        await enableReminder(subId);
      } else {
        await disableReminder(subId);
      }
    } catch (err) {
      console.error("Toggle failed", err);
      // Revert UI if API fails
      loadReminders();
      alert("Failed to update status. Please try again.");
    }
  };

  // Filter logic for Search
  const filtered = reminders.filter((r) => {
    const name = r.subscriptionId?.name || r.subscriptionName || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (loading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FiBell className="text-pink-500" /> Notification Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Toggle alerts and manage notification schedules.
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full sm:w-72">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Search reminders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Reminders Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-white/5 border-dashed">
          <FiBellOff className="mx-auto h-12 w-12 text-slate-600 mb-3" />
          <p className="text-slate-500 text-lg">No reminders found.</p>
          <p className="text-slate-600 text-sm">Add a subscription to start tracking reminders.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((reminder) => {
            const subName = reminder.subscriptionId?.name || "Unknown Subscription";
            const isSnoozed = !!reminder.snoozeUntil;
            // Handle both object id or string id
            const subId = reminder.subscriptionId?._id || reminder.subscriptionId;
            
            return (
              <div 
                key={reminder._id}
                className={`
                  relative p-5 rounded-xl border transition duration-200 flex flex-col gap-4
                  ${reminder.isEnabled 
                    ? "bg-slate-800/60 border-indigo-500/30 shadow-lg shadow-indigo-900/10" 
                    : "bg-slate-900/40 border-white/5 opacity-75 grayscale-[0.5]"
                  }
                `}
              >
                {/* Top Row: Name + Toggle Switch */}
                <div className="flex justify-between items-start">
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-white text-lg truncate pr-2" title={subName}>
                      {subName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                       {isSnoozed ? (
                         <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1">
                           <FiClock size={10} /> Snoozed
                         </span>
                       ) : reminder.isEnabled ? (
                         <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                           Active
                         </span>
                       ) : (
                         <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-400 border border-slate-600">
                           Disabled
                         </span>
                       )}
                    </div>
                  </div>

                  {/* The Toggle Switch */}
                  <button
                    onClick={() => toggleStatus(reminder)}
                    className={`
                      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none
                      ${reminder.isEnabled ? 'bg-indigo-600' : 'bg-slate-700'}
                    `}
                  >
                    <span
                      className={`
                        inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
                        ${reminder.isEnabled ? 'translate-x-6' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>

                {/* Info Block */}
                <div className="bg-slate-950/30 rounded-lg p-3 text-sm space-y-2">
                   <div className="flex justify-between text-slate-400">
                      <span>Notify:</span>
                      <span className="text-slate-200">{reminder.reminderDaysBefore} days before</span>
                   </div>
                   <div className="flex justify-between text-slate-400">
                      <span>Time:</span>
                      <span className="text-slate-200">{reminder.reminderTime || "09:00"}</span>
                   </div>
                   {isSnoozed && (
                     <div className="flex justify-between text-orange-400/80 pt-1 border-t border-white/5">
                        <span>Until:</span>
                        <span>{formatDate(reminder.snoozeUntil)}</span>
                     </div>
                   )}
                </div>

                {/* Configure Button - Fixes navigation bug */}
                <Button 
                  variant="secondary" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate(`/subscriptions/${subId}/reminder`)}
                >
                  <FiSettings size={14} /> Configure Settings
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}