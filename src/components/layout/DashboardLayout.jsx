import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Menu, Sparkles } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeToggle from "../ui/ThemeToggle";
import ProfileDropdown from "../ui/ProfileDropdown";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  // AI is opened per-page via context; sidebar button navigates to dashboard and signals open
  const handleAIOpen = () => navigate("/dashboard?ai=1");

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="pointer-events-none fixed top-0 left-0 w-96 h-96 opacity-30 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="flex items-center justify-between px-1 sm:px-6 py-3 border-b border-slate-200 dark:border-white/[0.06] bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all">
              <Menu size={20} />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-cyan-500">
                <span className="text-dark-900 font-bold text-xs">T</span>
              </div>
              <span className="text-sm font-bold font-display text-slate-900 dark:text-slate-100">TaskFlow</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleAIOpen}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", color: "#06b6d4" }}
            >
              <Sparkles size={13} /> AI
            </button>
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Desktop-only AI floating button */}
        <button
          onClick={handleAIOpen}
          title="AI Assistant"
          className="hidden md:flex items-center justify-center fixed bottom-6 right-6 w-13 h-13 rounded-2xl z-40 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            width: "52px",
            height: "52px",
            background: "linear-gradient(135deg, #06b6d4, #0891b2)",
            boxShadow: "0 0 0 1px rgba(6,182,212,0.3), 0 8px 32px rgba(6,182,212,0.35), 0 0 60px rgba(6,182,212,0.15)",
          }}
        >
          <Sparkles size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
}
