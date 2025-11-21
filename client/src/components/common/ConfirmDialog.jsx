// src/components/common/ConfirmDialog.jsx
import Button from "./Button";

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onClose,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111827cc] to-[#1e1b4bcc]
        rounded-2xl shadow-2xl border border-white/10 p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-bold text-pink-400">{title}</h2>
        <p className="text-white/80">{message}</p>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
