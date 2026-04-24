import { Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function AppLoader({ message = "Loading..." }) {
  const { isDark } = useTheme();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #030d12 0%, #061520 50%, #030d12 100%)"
          : "#f1f5f9",
      }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Logo mark */}
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "#06b6d4",
            boxShadow: "0 0 40px rgba(6,182,212,0.5)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          <Zap size={26} color="#030d12" fill="#030d12" />
        </div>

        <span
          className="text-2xl font-bold"
          style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}
        >
          TaskFlow
        </span>
      </div>

      {/* Spinner + message */}
      <div className="flex flex-col items-center gap-3">
        {/* Track bar */}
        <div
          className="w-48 h-0.5 rounded-full overflow-hidden"
          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #0e7490, #06b6d4, #22d3ee)",
              animation: "loadingBar 1.4s ease-in-out infinite",
              width: "40%",
            }}
          />
        </div>

        <p
          className="text-xs font-mono"
          style={{ color: isDark ? "#475569" : "#94a3b8" }}
        >
          {message}
        </p>
      </div>

      <style>{`
        @keyframes loadingBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(350%); }
        }
      `}</style>
    </div>
  );
}
