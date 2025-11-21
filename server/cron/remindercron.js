import cron from "node-cron";
import { DateTime } from "luxon";
import Reminder from "../models/Reminder.js";
import Subscription from "../models/Subscription.js";
import User from "../models/User.js";
import { sendReminderEmail } from "../utils/email.js";

// ... (Your helper function computeTargetUTC remains exactly the same) ...
function computeTargetUTC(reminder, subscription) {
  const tz = reminder.userTimezone || "Asia/Kolkata";
  const renewalUtc = DateTime.fromJSDate(subscription.renewalDate, { zone: "utc" });
  let renewalLocal = renewalUtc.setZone(tz);
  let targetLocal = renewalLocal.minus({
    days: reminder.reminderDaysBefore || 0,
  });

  if (reminder.reminderTime) {
    const [h, m] = reminder.reminderTime.split(":").map(Number);
    targetLocal = targetLocal.set({ hour: h, minute: m, second: 0, millisecond: 0 });
  } else {
    targetLocal = targetLocal.set({ hour: 9, minute: 0, second: 0, millisecond: 0 });
  }
  return targetLocal.toUTC();
}

const startReminderCron = () => {
  console.log("🔁 Reminder cron started (every minute)");

  // Run every minute
  cron.schedule("* * * * *", async () => {
    try {
      const nowUtc = DateTime.utc();
      
      // 1. Fetch enabled reminders
      // Populate subscription to ensure we don't process deleted/inactive ones
      const reminders = await Reminder.find({ isEnabled: true });

      for (const reminder of reminders) {
        const subscription = await Subscription.findById(reminder.subscriptionId);
        if (!subscription || !subscription.isActive) continue;

        const user = await User.findById(reminder.userId);
        if (!user) continue;

        // 2. Snooze Logic
        if (reminder.snoozeUntil) {
          const snoozeUTC = DateTime.fromJSDate(reminder.snoozeUntil, { zone: "utc" });
          const diff = snoozeUTC.diff(nowUtc, "seconds").seconds;

          // If passed snooze time (allow 60s buffer)
          if (diff <= 0 && diff > -60) {
            console.log(`💤 Snoozed reminder firing for ${user.email}`);
            await sendReminderEmail(user.email, subscription);

            reminder.lastReminderSent = new Date();
            reminder.snoozeUntil = null;
            reminder.status = "scheduled";
            await reminder.save();
          }
          continue; 
        }

        // 3. Scheduled Logic
        const targetUtc = computeTargetUTC(reminder, subscription);
        const diffSeconds = targetUtc.diff(nowUtc, "seconds").seconds;

        // 4. Duplicate Check
        if (reminder.lastReminderSent) {
          const last = DateTime.fromJSDate(reminder.lastReminderSent, { zone: "utc" });
          // If sent today already, skip
          if (last.hasSame(nowUtc, "day")) continue;
        }

        // 5. Trigger Window (Check if we are within 1 minute of target)
        if (diffSeconds <= 0 && diffSeconds > -60) {
          console.log(`📩 Sending reminder to ${user.email}`);
          
          const success = await sendReminderEmail(user.email, subscription);

          if (success) {
            reminder.lastReminderSent = new Date();
            reminder.status = "scheduled";
            await reminder.save();
          }
        }
      }
    } catch (err) {
      console.error("❌ Cron error:", err.message);
    }
  });
};

export default startReminderCron;