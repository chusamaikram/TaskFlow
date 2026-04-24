import { useTheme } from "../../context/ThemeContext";

const configs = {
  todo:       { label: "To Do",      dot: "#64748b", dark: { bg: "rgba(100,116,139,0.12)", color: "#94a3b8"  }, light: { bg: "rgba(100,116,139,0.1)",  color: "#64748b"  } },
  inprogress: { label: "In Progress",dot: "#06b6d4", dark: { bg: "rgba(6,182,212,0.12)",   color: "#22d3ee"  }, light: { bg: "rgba(6,182,212,0.1)",    color: "#0891b2"  } },
  done:       { label: "Done",       dot: "#34d399", dark: { bg: "rgba(16,185,129,0.12)",  color: "#34d399"  }, light: { bg: "rgba(16,185,129,0.1)",   color: "#059669"  } },
  high:       { label: "High",       dot: "#f87171", dark: { bg: "rgba(239,68,68,0.1)",    color: "#f87171"  }, light: { bg: "rgba(239,68,68,0.08)",   color: "#dc2626"  } },
  medium:     { label: "Medium",     dot: "#fbbf24", dark: { bg: "rgba(245,158,11,0.1)",   color: "#fbbf24"  }, light: { bg: "rgba(245,158,11,0.08)",  color: "#d97706"  } },
  low:        { label: "Low",        dot: "#94a3b8", dark: { bg: "rgba(100,116,139,0.1)",  color: "#64748b"  }, light: { bg: "rgba(100,116,139,0.08)", color: "#94a3b8"  } },
};

export default function Badge({ type, children }) {
  const { isDark } = useTheme();
  const config = configs[type] || { label: type, dot: "#64748b", dark: { bg: "rgba(100,116,139,0.12)", color: "#94a3b8" }, light: { bg: "rgba(100,116,139,0.1)", color: "#64748b" } };
  const theme = isDark ? config.dark : config.light;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-md"
      style={{
        background: theme.bg,
        color: theme.color,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.01em",
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: config.dot, opacity: 0.9 }} />
      {children || config.label}
    </span>
  );
}
