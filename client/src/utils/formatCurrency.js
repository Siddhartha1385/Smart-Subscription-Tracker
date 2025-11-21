// src/utils/formatCurrency.js
export default function formatCurrency(amount, currency = "INR") {
  if (amount === null || amount === undefined || isNaN(Number(amount))) {
    return "-";
  }

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    // Fallback if Intl or currency fails
    return `₹${Number(amount).toFixed(0)}`;
  }
}
