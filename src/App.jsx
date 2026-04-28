import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import { AIProvider } from "./context/AIContext";
import AppRoutes from "./routes/AppRoutes";

const TOAST_STYLE = {
  style: {
    background: "#0b1e2d",
    color: "#e2e8f0",
    border: "1px solid rgba(6,182,212,0.2)",
    borderRadius: "0.75rem",
    fontSize: "0.875rem",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },
  success: { iconTheme: { primary: "#34d399", secondary: "#0b1e2d" } },
  error:   { iconTheme: { primary: "#f87171", secondary: "#0b1e2d" } },
  duration: 3000,
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <TaskProvider>
            <AIProvider>
              <AppRoutes />
              <Toaster position="top-right" toastOptions={TOAST_STYLE} />
            </AIProvider>
          </TaskProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
