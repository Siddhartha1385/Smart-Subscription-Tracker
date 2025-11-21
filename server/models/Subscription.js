import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: "INR" },

    // Smart logic fields
    issuedDate: { type: Date, default: null },  // optional (smart detection)
    renewalDate: { type: Date, required: true },
    renewalCycleDays: { type: Number, required: true }, // stored in days always
    renewalFrequencyLabel: { type: String, default: "Custom" },

    category: { type: String, default: "General" },
    paymentMethod: { type: String, default: "None" },
    autoDebit: { type: Boolean, default: false },

    note: { type: String, default: "" },

    // History for analytics
    renewalHistory: [
      {
        date: { type: Date },
        amount: { type: Number },
      }
    ],

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", SubscriptionSchema);
