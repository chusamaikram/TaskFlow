export default function StatsCard({ icon: Icon, label, value, color = "#06b6d4", sub }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs mb-1 uppercase tracking-widest font-mono text-slate-500">{label}</p>
          <p className="text-3xl font-bold font-display" style={{ color }}>{value}</p>
          {sub && <p className="text-xs mt-1 text-slate-600 dark:text-slate-600">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}28` }}>
          <Icon size={19} style={{ color }} />
        </div>
      </div>
    </div>
  );
}
