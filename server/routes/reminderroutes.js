import express from "express";
import auth from "../middlewares/authmiddleware.js";

import {
  getAllReminders,
  getReminder,
  updateReminder,
  snoozeReminder,
  enableReminder,
  disableReminder
} from "../controllers/remindercontroller.js";

const router = express.Router();

// All reminder routes require auth
router.use(auth);

// Get ALL reminders for the logged-in user
router.get("/", getAllReminders);

// Get reminder for a single subscription
router.get("/:subscriptionId", getReminder);

// Update reminder settings
router.put("/:subscriptionId", updateReminder);

// Snooze reminder
router.post("/:subscriptionId/snooze", snoozeReminder);

// Enable reminder
router.post("/:subscriptionId/enable", enableReminder);

// Disable reminder
router.post("/:subscriptionId/disable", disableReminder);

export default router;
