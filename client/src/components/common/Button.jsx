// src/components/common/Button.jsx
export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
}) {
  const base =
    "px-4 py-2 rounded-xl font-semibold transition-all duration-300 backdrop-blur-md shadow-lg";
  const variants = {
    primary:
      "bg-gradient-to-r from-[#7b2ff7] to-[#f107a3] text-white hover:opacity-90 hover:shadow-pinkGlow",
    secondary:
      "bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:shadow-lg",
    danger:
      "bg-red-500/40 text-red-200 hover:bg-red-600/60 border border-red-700/50",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}
