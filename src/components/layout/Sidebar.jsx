import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Zap, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Avatar from "../ui/Avatar";

const NAV = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/profile",   icon: User,            label: "Profile"   },
];

// Shared sidebar content used by both desktop and mobile drawer
function SidebarContent({ collapsed, onCollapse, onClose, isMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { await logout(); navigate("/"); };

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className={`flex items-center p-4 pb-3 ${collapsed && !isMobile ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-cyan-500 shadow-cyan">
            <Zap size={15} className="text-dark-900" fill="currentColor" />
          </div>
          {(!collapsed || isMobile) && (
            <span className="text-lg font-bold font-display text-slate-900 dark:text-slate-100 truncate">TaskFlow</span>
          )}
        </div>
        {/* Mobile close button */}
        {isMobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-all">
            <X size={18} />
          </button>
        )}
        {/* Desktop collapse button */}
        {!isMobile && !collapsed && (
          <button onClick={() => onCollapse(true)} className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all">
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Desktop expand button when collapsed */}
      {!isMobile && collapsed && (
        <div className="flex justify-center px-3 pb-3">
          <button onClick={() => onCollapse(false)} className="w-full flex items-center justify-center p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/[0.08] transition-all">
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      <div className="h-px bg-slate-100 dark:bg-white/[0.05] mx-4" />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {(!collapsed || isMobile) && (
          <p className="text-xs uppercase tracking-widest mb-3 px-2 font-mono text-slate-600">Menu</p>
        )}
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed && !isMobile ? label : undefined}
            onClick={isMobile ? onClose : undefined}
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""} ${collapsed && !isMobile ? "justify-center px-0" : ""}`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {(!collapsed || isMobile) && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user card */}
      <div className="p-3 space-y-2">
        <div className={`flex items-center rounded-xl p-2.5 bg-cyan-500/[0.05] border border-cyan-500/10 ${collapsed && !isMobile ? "justify-center" : "gap-3"}`}>
          <Avatar name={user?.name} size="sm" />
          {(!collapsed || isMobile) && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold font-display text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role || "Team Member"}</p>
              </div>
              <button onClick={handleLogout} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] transition-colors flex-shrink-0" title="Logout">
                <LogOut size={14} />
              </button>
            </>
          )}
        </div>

        {collapsed && !isMobile && (
          <button onClick={handleLogout} className="w-full flex items-center justify-center p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/[0.08] border border-transparent hover:border-rose-500/15 transition-all" title="Logout">
            <LogOut size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-900/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-white border-r border-slate-200 dark:bg-gradient-to-b dark:from-dark-800 dark:to-dark-900 dark:border-white/[0.06] transition-transform duration-300 md:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent collapsed={false} onCollapse={setCollapsed} onClose={onMobileClose} isMobile />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col ${collapsed ? "w-[68px]" : "w-64"} h-screen sticky top-0 flex-shrink-0 transition-all duration-200 bg-white border-r border-slate-200 dark:bg-gradient-to-b dark:from-dark-800 dark:to-dark-900 dark:border-white/[0.06]`}>
        <SidebarContent collapsed={collapsed} onCollapse={setCollapsed} onClose={onMobileClose} isMobile={false} />
      </aside>
    </>
  );
}
