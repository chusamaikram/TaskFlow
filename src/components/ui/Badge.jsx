const BADGE = {
  todo:       { label: "To Do",       cls: "bg-slate-500/10 text-slate-400 dark:bg-slate-500/10 dark:text-slate-400",       dot: "bg-slate-400" },
  inprogress: { label: "In Progress", cls: "bg-cyan-500/10  text-cyan-600  dark:bg-cyan-500/10  dark:text-cyan-400",        dot: "bg-cyan-500"  },
  done:       { label: "Done",        cls: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400", dot: "bg-emerald-400" },
  high:       { label: "High",        cls: "bg-rose-500/10  text-rose-600   dark:bg-rose-500/10   dark:text-rose-400",       dot: "bg-rose-400"  },
  medium:     { label: "Medium",      cls: "bg-amber-500/10 text-amber-600  dark:bg-amber-500/10  dark:text-amber-400",      dot: "bg-amber-400" },
  low:        { label: "Low",         cls: "bg-slate-500/10 text-slate-500  dark:bg-slate-500/10  dark:text-slate-400",      dot: "bg-slate-400" },
};

export default function Badge({ type, children }) {
  const config = BADGE[type] || BADGE.low;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {children || config.label}
    </span>
  );
}
