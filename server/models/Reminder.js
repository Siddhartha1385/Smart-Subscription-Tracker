import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // How many days earlier the reminder should trigger
    reminderDaysBefore: { type: Number, default: 0 },

    // Preferred reminder time
    reminderTime: { type: String, default: null }, // Example: "18:30"
    userTimezone: { type: String, default: "Asia/Kolkata" },

    // Snooze features
    snoozeUntil: { type: Date, default: null },
    snoozeCount: { type: Number, default: 0 },

    // Tracking last sent reminder to avoid duplicates
    lastReminderSent: { type: Date, default: null },

    status: {
      type: String,
      enum: ["scheduled", "snoozed", "disabled"],
      default: "scheduled",
    },

    isEnabled: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", ReminderSchema);
