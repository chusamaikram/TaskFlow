import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, User, LogOut, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Avatar from "../ui/Avatar";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/profile",   icon: User,            label: "Profile"   },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const w        = collapsed ? "w-[68px]" : "w-64";
  const bg       = isDark ? "linear-gradient(180deg, #061520 0%, #030d12 100%)" : "#ffffff";
  const border   = isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0";
  const labelClr = isDark ? "#e2e8f0" : "#0f172a";
  const subClr   = isDark ? "#64748b" : "#94a3b8";
  const divClr   = isDark ? "rgba(255,255,255,0.05)" : "#f1f5f9";

  return (
    <aside
      className={`${w} h-screen flex flex-col sticky top-0 flex-shrink-0 transition-all duration-200`}
      style={{ background: bg, borderRight: `1px solid ${border}` }}
    >
      {/* Logo */}
      <div className={`flex items-center p-4 pb-3 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "#06b6d4", boxShadow: "0 0 16px rgba(6,182,212,0.35)" }}
          >
            <Zap size={15} color="#030d12" fill="#030d12" />
          </div>
          {!collapsed && (
            <span
              className="text-lg font-bold truncate"
              style={{ fontFamily: "'Syne', sans-serif", color: labelClr }}
            >
              TaskFlow
            </span>
          )}
        </div>

        {/* Collapse button — only shown inline when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg transition-all flex-shrink-0"
            style={{ color: subClr }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#06b6d4"; e.currentTarget.style.background = "rgba(6,182,212,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = subClr; e.currentTarget.style.background = "transparent"; }}
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand button — shown as its own row when collapsed */}
      {collapsed && (
        <div className="flex justify-center px-3 pb-3">
          <button
            onClick={() => setCollapsed(false)}
            className="w-full flex items-center justify-center p-1.5 rounded-lg transition-all"
            style={{ color: subClr }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#06b6d4"; e.currentTarget.style.background = "rgba(6,182,212,0.08)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = subClr; e.currentTarget.style.background = "transparent"; }}
            title="Expand sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: "1px", background: divClr, margin: "0 1rem" }} />

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p
            className="text-xs uppercase tracking-widest mb-3 px-2 font-mono"
            style={{ color: subClr }}
          >
            Menu
          </p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            className={({ isActive }) => `sidebar-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-2">
        {/* User card */}
        <div
          className={`flex items-center rounded-xl p-2.5 ${collapsed ? "justify-center" : "gap-3"}`}
          style={{ background: "rgba(6,182,212,0.05)", border: "1px solid rgba(6,182,212,0.1)" }}
        >
          <Avatar name={user?.name} size="sm" />
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ fontFamily: "'Syne', sans-serif", color: labelClr }}>
                  {user?.name}
                </p>
                <p className="text-xs truncate" style={{ color: subClr }}>{user?.role || "Team Member"}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg transition-colors flex-shrink-0"
                style={{ color: subClr }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = subClr;    e.currentTarget.style.background = "transparent"; }}
                title="Logout"
              >
                <LogOut size={14} />
              </button>
            </>
          )}
          {collapsed && (
            <button
              onClick={handleLogout}
              className="p-1 rounded-lg transition-colors absolute"
              style={{ color: subClr, display: "none" }}
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>

        {/* Logout button when collapsed */}
        {collapsed && (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-2.5 rounded-xl transition-all"
            style={{ color: subClr, border: "1px solid transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#f87171"; e.currentTarget.style.background = "rgba(239,68,68,0.08)"; e.currentTarget.style.borderColor = "rgba(239,68,68,0.15)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = subClr;    e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </aside>
  );
}
