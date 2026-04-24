import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="relative flex items-center w-14 h-7 rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: isDark ? "rgba(6,182,212,0.2)" : "rgba(6,182,212,0.3)",
        border: "1px solid rgba(6,182,212,0.3)",
      }}
    >
      <span
        className="absolute flex items-center justify-center w-5 h-5 rounded-full transition-all duration-300"
        style={{
          left: isDark ? "2px" : "calc(100% - 22px)",
          background: "#06b6d4",
          boxShadow: "0 0 10px rgba(6,182,212,0.5)",
        }}
      >
        {isDark ? <Moon size={11} color="#030d12" /> : <Sun size={11} color="#030d12" />}
      </span>
    </button>
  );
}
