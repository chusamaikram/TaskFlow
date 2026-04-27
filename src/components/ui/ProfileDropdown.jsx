import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "./Avatar";

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSettings = () => { setOpen(false); navigate("/profile"); };
  const handleLogout   = async () => { setOpen(false); await logout(); navigate("/"); };

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-cyan-500/20 hover:bg-cyan-500/[0.06] transition-all duration-150"
      >
        <Avatar name={user?.name} size="sm" />
        <div className="hidden sm:block text-left min-w-0">
          <p className="text-sm font-semibold font-display text-slate-100 light:text-slate-900 truncate max-w-[120px]">{user?.name}</p>
          <p className="text-xs text-slate-500 truncate max-w-[120px]">{user?.email}</p>
        </div>
        <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/[0.08] bg-dark-700 light:bg-white light:border-slate-200 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-50 overflow-hidden animate-slide-up">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-white/[0.06] light:border-slate-100">
            <p className="text-sm font-semibold font-display text-slate-100 light:text-slate-900 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email}</p>
          </div>

          {/* Actions */}
          <div className="p-1.5 space-y-0.5">
            <button
              onClick={handleSettings}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 light:text-slate-700 hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all"
            >
              <Settings size={15} className="flex-shrink-0" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 light:text-slate-700 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-all"
            >
              <LogOut size={15} className="flex-shrink-0" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
