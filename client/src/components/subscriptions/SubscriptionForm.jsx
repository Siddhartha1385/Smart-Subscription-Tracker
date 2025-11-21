import React, { useEffect, useState } from "react";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const BILLING_PRESETS = {
  monthly: { days: 30, label: "Monthly" },
  yearly: { days: 365, label: "Yearly" },
  weekly: { days: 7, label: "Weekly" },
  custom: { days: null, label: "Custom" },
};

export default function SubscriptionForm({
  open,
  onClose,
  editData = null,
  onSave,
}) {
  const isEdit = !!editData;

  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    billingCycle: "monthly",
    customCycleDays: "",
    renewalDate: "",
    note: "",
    autoDebit: false,
    currency: "INR",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editData) {
      const billingCycle = editData.renewalFrequencyLabel
        ? editData.renewalFrequencyLabel.toLowerCase()
        : editData.billingCycle || "monthly";

      const isPreset = BILLING_PRESETS[billingCycle];
      
      setForm({
        name: editData.name || "",
        price: editData.price ?? "",
        category: editData.category || "",
        billingCycle: isPreset ? billingCycle : "custom",
        customCycleDays: editData.renewalCycleDays || "",
        renewalDate: editData.renewalDate
          ? new Date(editData.renewalDate).toISOString().substring(0, 10)
          : "",
        note: editData.note || "",
        autoDebit: Boolean(editData.autoDebit),
        currency: editData.currency || "INR",
      });
    } else {
      setForm({
        name: "",
        price: "",
        category: "",
        billingCycle: "monthly",
        customCycleDays: "",
        renewalDate: "",
        note: "",
        autoDebit: false,
        currency: "INR",
      });
    }
  }, [editData, open]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function computeRenewalCycleDays(billingCycle, customCycleDays) {
    if (billingCycle === "custom") {
      const n = Number(customCycleDays);
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : 30; // Default to 30 if invalid
    }
    const preset = BILLING_PRESETS[billingCycle];
    return preset ? preset.days : 30;
  }

  async function handleSubmit(e) {
    e?.preventDefault?.();

    if (!form.name || !form.price || !form.renewalDate) {
      alert("Please fill name, price and renewal date.");
      return;
    }

    const renewalCycleDays = computeRenewalCycleDays(
      form.billingCycle,
      form.customCycleDays
    );

    const payload = {
      name: form.name,
      price: Number(form.price),
      currency: form.currency || "INR",
      renewalDate: new Date(form.renewalDate),
      renewalCycleDays: renewalCycleDays,
      renewalFrequencyLabel: form.billingCycle === "custom" 
        ? `Custom (${renewalCycleDays} days)` 
        : BILLING_PRESETS[form.billingCycle]?.label || "Monthly",
      category: form.category || "General",
      paymentMethod: form.autoDebit ? "AutoDebit" : "Manual",
      autoDebit: Boolean(form.autoDebit),
      note: form.note || "",
    };

    try {
      setSaving(true);
      const id = editData?._id || editData?.id || null;
      await onSave(payload, id);
      onClose();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save subscription.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit Subscription" : "Add Subscription"}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (isEdit ? "Saving..." : "Adding...") : (isEdit ? "Save Changes" : "Add Subscription")}
          </Button>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Name" name="name" value={form.name} onChange={handleChange} />
        <Input label="Price (₹)" name="price" type="number" value={form.price} onChange={handleChange} />
        <Input label="Category" name="category" value={form.category} onChange={handleChange} placeholder="OTT / Music / Cloud" />
        
        <div>
          <label className="text-sm font-medium text-gray-700">Billing Cycle</label>
          <Select
            name="billingCycle"
            value={form.billingCycle}
            onChange={handleChange}
            options={[
              { value: "monthly", label: "Monthly (≈30 days)" },
              { value: "yearly", label: "Yearly (≈365 days)" },
              { value: "weekly", label: "Weekly (7 days)" },
              { value: "custom", label: "Custom (days)" },
            ]}
          />
        </div>

        {form.billingCycle === "custom" && (
          <Input label="Custom cycle (days)" name="customCycleDays" type="number" value={form.customCycleDays} onChange={handleChange} />
        )}

        <Input label="Renewal Date" name="renewalDate" type="date" value={form.renewalDate} onChange={handleChange} />

        <div className="flex items-center gap-3">
          <input name="autoDebit" type="checkbox" checked={form.autoDebit} onChange={handleChange} />
          <label className="text-sm text-gray-700">Auto-debit enabled</label>
        </div>

        <Input label="Note" name="note" value={form.note} onChange={handleChange} />
      </form>
    </Modal>
  );
}