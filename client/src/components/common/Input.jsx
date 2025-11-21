// src/components/common/Input.jsx
export default function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder = "",
  className = "",
}) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-white/90">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-xl bg-white/10 text-white placeholder-white/50
          backdrop-blur-md border border-white/20 focus:border-pink-500/70 focus:outline-none 
          focus:ring focus:ring-pink-600/40 transition-all duration-300 ${className}`}
      />
    </div>
  );
}
