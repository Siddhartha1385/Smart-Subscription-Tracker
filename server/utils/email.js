import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// 1. Load Environment Variables
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// 2. DEBUG LOGS (Check Render logs to confirm it picked up Port 2525)
console.log("--------------------------------");
console.log("📧 EMAIL SYSTEM INITIALIZED");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT); // Should say 2525
console.log("USER:", process.env.EMAIL_USER ? "Set (Hidden)" : "MISSING");
console.log("--------------------------------");

// 3. Create Robust Transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), 
  secure: false, // Always false for Port 2525 or 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // 4. Timeout Settings (Prevents infinite hanging)
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

// 5. The Reminder Function
export async function sendReminderEmail(to, subscription) {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER) {
    console.error("❌ CRITICAL: Email environment variables are missing.");
    return false;
  }

  try {
    const formattedDate = new Date(subscription.renewalDate).toLocaleDateString();

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9;">
      <div style="max-width: 600px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <h2 style="color: #4f46e5;">Subscription Renewal Reminder</h2>
        <p>Hi there,</p>
        <p>Your subscription for <strong>${subscription.name}</strong> is set to renew on <strong>${formattedDate}</strong>.</p>
        <p>Amount: <strong>₹${subscription.price}</strong></p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">This is an automated message from your Smart Subscription Tracker.</p>
      </div>
    </div>
    `;

    // Verify connection before sending
    await transporter.verify();
    console.log("✅ SMTP Connection Verified");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Smart Tracker" <no-reply@smartsub.com>',
      to,
      subject: `Reminder: ${subscription.name} renews soon`,
      html: htmlContent,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return true;
  } catch (err) {
    console.error("❌ Email Transport Error:", err.message);
    return false;
  }
}