// src/components/common/Modal.jsx
export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#111827cc] to-[#1e1b4bcc]
        rounded-2xl shadow-2xl border border-white/10 w-full max-w-lg p-6">
        {title && (
          <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        )}
        <div className="space-y-4">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </div>
    </div>
  );
}
