import { Pencil, Trash2, Calendar, CheckCheck } from "lucide-react";
import Badge from "../ui/Badge";
import { useTheme } from "../../context/ThemeContext";

const STATUS_STRIPE = { done: "#34d399", inprogress: "#06b6d4", todo: "#334155" };

const PRIORITY_DOT = { high: "#f87171", medium: "#fbbf24", low: "#64748b" };

export default function TaskCard({ task, onEdit, onDelete, onView, onComplete }) {
  const { isDark } = useTheme();
  const stripe = STATUS_STRIPE[task.status] || "#334155";

  return (
    <div
      className="group relative cursor-pointer rounded-xl overflow-hidden"
      style={{
        background: isDark ? "#0b1e2d" : "#ffffff",
        border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)",
        boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 1px 4px rgba(0,0,0,0.07)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = isDark
          ? "0 8px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.15)"
          : "0 6px 20px rgba(0,0,0,0.1), 0 0 0 1px rgba(6,182,212,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isDark ? "0 2px 8px rgba(0,0,0,0.35)" : "0 1px 4px rgba(0,0,0,0.07)";
      }}
      onClick={() => onView?.(task)}
    >
      {/* Top status stripe */}
      <div className="h-0.5 w-full" style={{ background: stripe, opacity: task.status === "todo" ? 0.3 : 0.8 }} />

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3
            className="text-sm font-semibold leading-snug flex-1"
            style={{
              fontFamily: "'Syne', sans-serif",
              color: task.status === "done"
                ? isDark ? "#475569" : "#94a3b8"
                : isDark ? "#e2e8f0" : "#0f172a",
              textDecoration: task.status === "done" ? "line-through" : "none",
            }}
          >
            {task.title}
          </h3>

          {/* Action buttons — hidden until hover */}
          <div
            className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: isDark ? "#475569" : "#cbd5e1" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#22d3ee"; e.currentTarget.style.background = "rgba(6,182,212,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? "#475569" : "#cbd5e1"; e.currentTarget.style.background = "transparent"; }}
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: isDark ? "#475569" : "#cbd5e1" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? "#475569" : "#cbd5e1"; e.currentTarget.style.background = "transparent"; }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p
            className="text-xs leading-relaxed line-clamp-2 mb-3"
            style={{ color: isDark ? "#475569" : "#94a3b8" }}
          >
            {task.description}
          </p>
        )}

        {/* Tags */}
        {task.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: isDark ? "rgba(6,182,212,0.07)" : "rgba(6,182,212,0.07)",
                  color: isDark ? "#67e8f9" : "#0891b2",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between mt-2 pt-3"
          style={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.04)" : "1px solid rgba(0,0,0,0.05)" }}
        >
          <div className="flex items-center gap-1.5">
            <Badge type={task.status} />
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: PRIORITY_DOT[task.priority] || "#64748b" }}
              title={task.priority}
            />
            {task.category && (
              <span
                className="text-xs"
                style={{
                  color: isDark ? "#334155" : "#cbd5e1",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                }}
              >
                {task.category}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div className="flex items-center gap-1">
                <Calendar size={10} style={{ color: isDark ? "#334155" : "#cbd5e1" }} />
                <span
                  className="text-xs"
                  style={{
                    color: isDark ? "#334155" : "#cbd5e1",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                  }}
                >
                  {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            )}

            {/* Mark as completed — only shown when not done */}
            {task.status !== "done" && (
              <button
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: "rgba(52,211,153,0.1)",
                  color: "#34d399",
                  fontFamily: "'DM Sans', sans-serif",
                  border: "1px solid rgba(52,211,153,0.2)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.2)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(52,211,153,0.1)"; }}
                onClick={(e) => { e.stopPropagation(); onComplete?.(task.id); }}
              >
                <CheckCheck size={11} />
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
