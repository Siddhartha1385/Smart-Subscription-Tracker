// routes/testemailroutes.js
import express from "express";
import { sendReminderEmail } from "../utils/email.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const to = req.query.to || process.env.SENDGRID_FROM;

  const ok = await sendReminderEmail(
    to,
    "Test Email from Subscription Tracker",
    new Date()
  );

  if (ok) return res.json({ message: `Email sent to ${to}` });
  return res.status(500).json({ message: "Failed to send email" });
});

export default router;
