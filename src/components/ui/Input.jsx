export default function Input({ label, error, icon: Icon, ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-400 mb-1.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        )}
        <input
          className="input-field"
          style={{ paddingLeft: Icon ? "2.5rem" : "1rem" }}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
