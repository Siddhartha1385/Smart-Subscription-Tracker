import Reminder from "../models/Reminder.js";
import Subscription from "../models/Subscription.js";


export const getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.userId })
      .populate("subscriptionId");

    res.json(reminders);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch reminders", error: err.message });
  }
};




// ---------------------------------------------------------------------
// GET reminder for a subscription
// ---------------------------------------------------------------------
export const getReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const reminder = await Reminder.findOne({
      subscriptionId,
      userId: req.userId
    });

    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    res.json(reminder);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// ---------------------------------------------------------------------
// UPDATE reminder settings
// ---------------------------------------------------------------------
export const updateReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const updates = req.body;

    // sanitize updates
    const allowed = [
      "reminderDaysBefore",
      "reminderTime",
      "userTimezone",
      "isEnabled"
    ];

    Object.keys(updates).forEach((key) => {
      if (!allowed.includes(key)) delete updates[key];
    });

    const reminder = await Reminder.findOneAndUpdate(
      { subscriptionId, userId: req.userId },
      updates,
      { new: true }
    );

    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found" });
    }

    // Clean snooze if user changed settings
    reminder.snoozeUntil = null;
    reminder.status = reminder.isEnabled ? "scheduled" : "disabled";
    reminder.snoozeCount = 0;
    await reminder.save();

    res.json({ msg: "Reminder updated", reminder });
  } catch (err) {
    res.status(500).json({ msg: "Update failed", error: err.message });
  }
};


// ---------------------------------------------------------------------
// SNOOZE reminder
// ---------------------------------------------------------------------
export const snoozeReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { snoozeDateTime } = req.body; // example: "2025-02-10T16:30:00"

    if (!snoozeDateTime) {
      return res.status(400).json({ msg: "snoozeDateTime required" });
    }

    const reminder = await Reminder.findOne({
      subscriptionId,
      userId: req.userId,
      isEnabled: true
    });

    if (!reminder) {
      return res.status(404).json({ msg: "Reminder not found or disabled" });
    }

    reminder.snoozeUntil = new Date(snoozeDateTime);
    reminder.snoozeCount += 1;
    reminder.status = "snoozed";

    await reminder.save();

    res.json({ msg: "Reminder snoozed", reminder });
  } catch (err) {
    res.status(500).json({ msg: "Snooze failed", error: err.message });
  }
};


// ---------------------------------------------------------------------
// ENABLE reminder
// ---------------------------------------------------------------------
export const enableReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const reminder = await Reminder.findOne({
      subscriptionId,
      userId: req.userId
    });

    if (!reminder) return res.status(404).json({ msg: "Reminder not found" });

    reminder.isEnabled = true;
    reminder.status = "scheduled";
    reminder.snoozeUntil = null;
    reminder.snoozeCount = 0;

    await reminder.save();

    res.json({ msg: "Reminder enabled", reminder });

  } catch (err) {
    res.status(500).json({ msg: "Enable failed", error: err.message });
  }
};


// ---------------------------------------------------------------------
// DISABLE reminder
// ---------------------------------------------------------------------
export const disableReminder = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const reminder = await Reminder.findOne({
      subscriptionId,
      userId: req.userId
    });

    if (!reminder) return res.status(404).json({ msg: "Reminder not found" });

    reminder.isEnabled = false;
    reminder.status = "disabled";
    reminder.snoozeUntil = null;

    await reminder.save();

    res.json({ msg: "Reminder disabled", reminder });

  } catch (err) {
    res.status(500).json({ msg: "Disable failed", error: err.message });
  }
};
