// ------------------------------
// Load environment FIRST
// ------------------------------
import dotenv from "dotenv";
dotenv.config();           // MUST be first

// Debug to verify .env works
console.log("DEBUG HOST:", process.env.EMAIL_HOST);
console.log("DEBUG USER:", process.env.EMAIL_USER);


import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Routes (loaded AFTER env)
import authroutes from "./routes/authroutes.js";
import subscriptionroutes from "./routes/subscriptionroutes.js";
import reminderroutes from "./routes/reminderroutes.js";
import testEmailRoutes from "./routes/testroutes.js";

import startReminderCron from "./cron/remindercron.js";

const app = express();

// Middlewares
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "1mb" }));

// Basic test route
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

// ------------------------------
// API Routes
// ------------------------------
app.use("/api/auth", authroutes);
app.use("/api/subscriptions", subscriptionroutes);
app.use("/api/reminders", reminderroutes);
app.use("/api/test-email", testEmailRoutes);
app.get('/ping', (req, res) => {
  res.status(200).send('Server is awake');
});

// ------------------------------
// Start server AFTER MongoDB
// ------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);

      // start cron AFTER DB + server are ready
      startReminderCron();
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
