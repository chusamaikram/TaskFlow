import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import DashboardLayout from "../components/layout/DashboardLayout";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import ForgotPassword from "../pages/ForgotPassword";

import AppLoader from "../components/ui/AppLoader";


// Protect authenticated pages
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}


// Prevent logged-in users from accessing login/signup
function GuestRoute({ children }) {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
}


export default function AppRoutes() {
  const { loading } = useAuth();

  // Wait until Firebase restores authentication state
  if (loading) {
    return <AppLoader message="Authenticating..." />;
  }

  return (
    <Routes>

      {/* Public Landing Page */}
      <Route path="/" element={<Landing />} />


      {/* Guest Routes */}
      <Route
        path="/login"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <GuestRoute>
            <Signup />
          </GuestRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        }
      />


      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Route>


      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}