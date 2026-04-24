import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

export default function DashboardLayout() {
  const { isDark } = useTheme();
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #030d12 0%, #061520 50%, #030d12 100%)"
          : "#f1f5f9",
      }}
    >
      <div
        className="pointer-events-none fixed top-0 left-0 w-96 h-96 opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
