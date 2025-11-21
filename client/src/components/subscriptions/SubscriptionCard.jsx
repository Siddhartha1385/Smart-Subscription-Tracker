// src/components/subscriptions/SubscriptionCard.jsx
import React, { useState } from "react";
import {
  FiEdit2,
  FiBell,
  FiClock,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import formatDate from "../../utils/formatDate";

export default function SubscriptionCard({
  subscription,
  onEdit = () => {},
  onReminder = () => {},
  onDelete = () => {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const category = subscription.category
    ? subscription.category.charAt(0).toUpperCase() +
      subscription.category.slice(1)
    : "Other";

  const cycleLabel =
    (subscription.renewalFrequencyLabel ||
      subscription.billingCycle ||
      "Monthly")?.toString() || "Monthly";

  const price = Number(subscription.price || 0);

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(subscription);
  };

  const handleReminder = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onReminder(subscription);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(subscription);
  };

  return (
    <div
      className="
        relative
        p-[1px]
        rounded-2xl
        bg-gradient-to-br
        from-sky-500/40 via-pink-500/30 to-sky-500/10
        shadow-[0_0_25px_rgba(14,165,233,0.35)]
        hover:shadow-[0_0_35px_rgba(236,72,153,0.55)]
        transition
        duration-200
      "
    >
      <div
        className="
          relative
          h-full
          rounded-2xl
          bg-slate-900/90
          border border-white/5
          backdrop-blur-xl
          px-4 py-4
          flex flex-col
          gap-4
        "
      >
        {/* Top row: name + menu */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-semibold text-slate-50">
              {subscription.name}
            </h3>
            <p className="text-xs md:text-sm text-slate-400">{category}</p>
          </div>

          {/* Kebab menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="
                p-2 rounded-full
                bg-slate-800/80
                hover:bg-slate-700
                text-slate-300
                hover:text-pink-300
                transition
              "
            >
              <FiMoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="
                  absolute right-0 mt-2 z-20
                  w-44
                  rounded-xl
                  bg-slate-900/95
                  border border-slate-700/60
                  shadow-xl shadow-pink-500/25
                  backdrop-blur-xl
                  text-xs md:text-sm
                  overflow-hidden
                "
              >
                <button
                  onClick={handleEdit}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-slate-800/90 text-slate-100"
                >
                  <FiEdit2 className="text-sky-400" />
                  <span>Edit subscription</span>
                </button>

                <button
                  onClick={handleReminder}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-slate-800/90 text-slate-100"
                >
                  <FiBell className="text-pink-400" />
                  <span>Reminder settings</span>
                </button>

                <button
                  onClick={handleDelete}
                  className="flex w-full items-center gap-2 px-3 py-2 hover:bg-red-950/60 text-red-300"
                >
                  <FiTrash2 />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Price + cycle */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-lg md:text-2xl font-bold text-pink-300">
              ₹{price.toLocaleString("en-IN")}
            </p>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {cycleLabel}
            </p>
          </div>

          {/* Subtle chip for auto-debit / active */}
          <div className="flex flex-col items-end gap-1">
            {subscription.autoDebit && (
              <span className="inline-flex items-center rounded-full bg-sky-500/15 border border-sky-400/40 px-2 py-1 text-[11px] font-medium text-sky-200">
                Auto-debit
              </span>
            )}
            {subscription.isActive === false ? (
              <span className="inline-flex items-center rounded-full bg-red-500/10 border border-red-400/50 px-2 py-1 text-[11px] font-medium text-red-200">
                Inactive
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-400/40 px-2 py-1 text-[11px] font-medium text-emerald-200">
                Active
              </span>
            )}
          </div>
        </div>

        {/* Renewal info */}
        <div className="flex items-center gap-2 text-xs md:text-sm text-slate-300">
          <FiClock className="w-4 h-4 text-sky-400" />
          <span>
            Next renewal:{" "}
            <span className="font-medium text-slate-50">
              {subscription.renewalDate
                ? formatDate(subscription.renewalDate)
                : "N/A"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
