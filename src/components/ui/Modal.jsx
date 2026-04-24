import { X } from "lucide-react";
import { useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  const { isDark } = useTheme();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeMap = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ background: isDark ? "rgba(3,13,18,0.85)" : "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-full ${sizeMap[size]} animate-slide-up flex flex-col`}
        style={{
          background:   isDark ? "#0b1e2d" : "#ffffff",
          border:       isDark ? "1px solid rgba(6,182,212,0.15)" : "1px solid #e2e8f0",
          boxShadow:    isDark ? "0 0 60px rgba(6,182,212,0.08), 0 24px 64px rgba(0,0,0,0.6)" : "0 24px 64px rgba(0,0,0,0.12)",
          borderRadius: "1rem",
          maxHeight:    "calc(100vh - 4rem)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9" }}
        >
          <h2
            className="text-base font-bold"
            style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: isDark ? "#475569" : "#94a3b8" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = isDark ? "#cbd5e1" : "#475569"; e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? "#475569" : "#94a3b8"; e.currentTarget.style.background = "transparent"; }}
          >
            <X size={17} />
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 modal-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
