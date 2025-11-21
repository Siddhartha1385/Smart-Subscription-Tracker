import Subscription from "../models/Subscription.js";
import Reminder from "../models/Reminder.js";

// Helper: map cycle days -> friendly label
function getLabelFromDays(days) {
  if (days >= 6 && days <= 9) return "Weekly";
  if (days >= 27 && days <= 32) return "Monthly";
  if (days >= 83 && days <= 96) return "Quarterly";
  if (days >= 350 && days <= 380) return "Yearly";
  return `Custom (${days} days)`;
}

// Create subscription
export const createSubscription = async (req, res) => {
  try {
    const {
      name,
      price,
      currency,
      issuedDate,
      renewalDate,
      renewalCycleDays,
      category,
      paymentMethod,
      autoDebit,
      note,
      // Allow user to set reminder preference on creation, or default to 1 day before
      reminderDaysBefore 
    } = req.body;

    if (!name || !price)
      return res.status(400).json({ msg: "Name & price are required" });

    let finalIssuedDate = issuedDate ? new Date(issuedDate) : null;
    let finalRenewalDate = renewalDate ? new Date(renewalDate) : null;
    
    // Ensure cycle days is valid
    let finalCycleDays = (renewalCycleDays !== undefined && renewalCycleDays !== null) 
      ? Number(renewalCycleDays) 
      : 30; // Default to Monthly

    if (!finalRenewalDate) {
      return res.status(400).json({ msg: "Renewal Date is required." });
    }

    // 1. Create Subscription
    const newSub = await Subscription.create({
      userId: req.userId,
      name,
      price,
      currency: currency || "INR",
      issuedDate: finalIssuedDate,
      renewalDate: finalRenewalDate,
      renewalCycleDays: finalCycleDays,
      renewalFrequencyLabel: getLabelFromDays(finalCycleDays),
      category: category || "General",
      paymentMethod: paymentMethod || "None",
      autoDebit: autoDebit || false,
      note: note || ""
    });

    // 2. Auto-Create Reminder (Matching YOUR specific Schema)
    try {
        await Reminder.create({
          subscriptionId: newSub._id,
          userId: req.userId,
          reminderDaysBefore: reminderDaysBefore !== undefined ? reminderDaysBefore : 1, // Default 1 day before
          reminderTime: "09:00", // Default morning alert
          userTimezone: "Asia/Kolkata", // Default timezone
          status: "scheduled",
          isEnabled: true,
          snoozeCount: 0,
          lastReminderSent: null
        });
    } catch (reminderError) {
        console.error("Reminder creation failed:", reminderError.message);
        // We don't fail the whole request, but we log it
    }

    res.status(201).json({
      msg: "Subscription created",
      subscription: newSub,
    });

  } catch (err) {
    console.error("Create Sub Error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all subscriptions
export const getallSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.userId })
      .sort({ renewalDate: 1 });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.renewalCycleDays) {
      updates.renewalFrequencyLabel = getLabelFromDays(
        Number(updates.renewalCycleDays)
      );
    }

    const sub = await Subscription.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );

    if (!sub) return res.status(404).json({ msg: "Not found" });

    res.json({ msg: "Updated", subscription: sub });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await Subscription.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!sub) return res.status(404).json({ msg: "Not found" });

    // Cleanup reminders using subscriptionId
    await Reminder.deleteMany({ subscriptionId: id });

    res.json({ msg: "Deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Renew subscription
export const renewSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const sub = await Subscription.findOne({
      _id: id,
      userId: req.userId
    });

    if (!sub) return res.status(404).json({ msg: "Not found" });

    const current = new Date(sub.renewalDate);
    const next = new Date(current.getTime() + sub.renewalCycleDays * 86400000);

    sub.renewalDate = next;

    // Add to renewal history
    sub.renewalHistory.push({
      date: current,
      amount: sub.price,
    });

    await sub.save();

    // OPTIONAL: Reset reminder status if you want a new reminder for the new date
    // This finds the reminder and resets 'lastReminderSent' so it triggers again next cycle
    await Reminder.findOneAndUpdate(
        { subscriptionId: id },
        { 
          status: "scheduled", 
          lastReminderSent: null,
          snoozeCount: 0, 
          snoozeUntil: null 
        }
    );

    res.json({ msg: "Renewed", subscription: sub });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};