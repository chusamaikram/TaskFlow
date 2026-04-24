import { useNavigate, Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

export default function LandingHeader() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: isDark
          ? "rgba(3,13,18,0.7)"
          : "rgba(241,245,249,0.75)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(0,0,0,0.07)",
        boxShadow: isDark
          ? "0 1px 24px rgba(0,0,0,0.4)"
          : "0 1px 12px rgba(0,0,0,0.06)",
      }}
    >
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-8 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#06b6d4", boxShadow: "0 0 16px rgba(6,182,212,0.4)" }}
          >
            <Zap size={16} color="#030d12" fill="#030d12" />
          </div>
          <span
            className="text-lg font-bold"
            style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}
          >
            TaskFlow
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button size="sm" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
}
