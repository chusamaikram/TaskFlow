import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="relative flex items-center w-14 h-7 rounded-full transition-all duration-300 focus:outline-none bg-cyan-500/20 border border-cyan-500/30"
    >
      <span
        className={`absolute flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500 shadow-cyan transition-all duration-300 ${isDark ? "left-0.5" : "left-[calc(100%-22px)]"}`}
      >
        {isDark ? <Moon size={11} className="text-dark-900" /> : <Sun size={11} className="text-dark-900" />}
      </span>
    </button>
  );
}
