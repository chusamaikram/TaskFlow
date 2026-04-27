import { useNavigate, Link } from "react-router-dom";
import { Zap } from "lucide-react";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

export default function LandingHeader() {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full bg-dark-900/70 light:bg-slate-100/75 backdrop-blur-xl border-b border-white/[0.06] light:border-black/[0.07] shadow-[0_1px_24px_rgba(0,0,0,0.4)] light:shadow-[0_1px_12px_rgba(0,0,0,0.06)]">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-8 h-16">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-cyan-500 shadow-cyan flex-shrink-0">
            <Zap size={16} className="text-dark-900" fill="currentColor" />
          </div>
          <span className="text-lg font-bold font-display text-slate-100 light:text-slate-900">TaskFlow</span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
        </div>
      </nav>
    </header>
  );
}
