// src/components/common/Select.jsx
export default function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  className = "",
}) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-white/90">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2 rounded-xl bg-white/10 text-white backdrop-blur-md
          border border-white/20 focus:border-pink-500/70 focus:outline-none 
          focus:ring focus:ring-pink-600/40 transition-all duration-300 ${className}`}
      >
        {options.map((opt) => (
          <option className="text-black" key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
