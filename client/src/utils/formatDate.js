export default function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  // Format: "24 Nov 2025"
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}