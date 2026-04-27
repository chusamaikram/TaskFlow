import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import ThemeToggle from "../ui/ThemeToggle";
import ProfileDropdown from "../ui/ProfileDropdown";

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 light:bg-slate-100">
      <div className="pointer-events-none fixed top-0 left-0 w-96 h-96 opacity-30 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top header — visible on all screen sizes */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.06] light:border-slate-200 bg-dark-800/80 light:bg-white/80 backdrop-blur-sm flex-shrink-0">
          {/* Left: hamburger (mobile only) + logo (mobile only) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all"
            >
              <Menu size={20} />
            </button>
            {/* Mobile logo */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-cyan-500">
                <span className="text-dark-900 font-bold text-xs">T</span>
              </div>
              <span className="text-sm font-bold font-display text-slate-100 light:text-slate-900">TaskFlow</span>
            </div>
          </div>

          {/* Right: theme toggle + profile dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <ProfileDropdown />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
