// src/components/common/Card.jsx
export default function Card({
  children,
  className = "",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-5 bg-white/10 backdrop-blur-lg border border-white/20
        shadow-xl hover:shadow-pinkShadow transition-all duration-300
        ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
