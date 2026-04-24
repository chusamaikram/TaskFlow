import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast.success("Reset email sent!");
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"  ? "No account found with this email." :
        err.code === "auth/invalid-email"   ? "Invalid email address." :
        err.code === "auth/too-many-requests" ? "Too many attempts. Please try again later." :
        "Failed to send reset email. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 grid-bg"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #030d12 0%, #061520 60%, #030d12 100%)"
          : "#f1f5f9",
      }}
    >
      <div
        className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div className="fixed top-5 right-5"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "#06b6d4", boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}
            >
              <Zap size={20} color="#030d12" fill="#030d12" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
              TaskFlow
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            Reset password
          </h1>
          <p style={{ color: isDark ? "#64748b" : "#475569", fontSize: "0.9rem" }}>
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: isDark ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.9)",
            border: "1px solid rgba(6,182,212,0.15)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(6,182,212,0.06)",
          }}
        >
          {sent ? (
            /* ── Success state ── */
            <div className="text-center space-y-4 py-2">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}
              >
                <CheckCircle2 size={26} style={{ color: "#34d399" }} />
              </div>

              <div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
                  Check your inbox
                </h3>
                <p className="text-sm" style={{ color: isDark ? "#64748b" : "#475569" }}>
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: "#06b6d4" }}>{email}</p>
              </div>

              <div
                className="rounded-xl p-4 text-left space-y-2"
                style={{
                  background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                  border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #e2e8f0",
                }}
              >
                <p className="text-xs font-semibold" style={{ color: isDark ? "#94a3b8" : "#475569" }}>What to do next:</p>
                {[
                  "Open the email from TaskFlow",
                  "Click the \"Reset password\" link",
                  "Choose a new strong password",
                  "Sign in with your new password",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                      style={{ background: "rgba(6,182,212,0.15)", color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace" }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-xs" style={{ color: isDark ? "#64748b" : "#64748b" }}>{step}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  className="font-semibold transition-colors"
                  style={{ color: "#06b6d4" }}
                >
                  try again
                </button>
              </p>

              <Button className="w-full" size="lg" onClick={() => window.location.href = "/login"}>
                Back to Sign In
              </Button>
            </div>
          ) : (
            /* ── Form state ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        {/* Back to login */}
        {!sent && (
          <div className="text-center mt-6">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm transition-colors"
              style={{ color: isDark ? "#64748b" : "#94a3b8" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#06b6d4"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = isDark ? "#64748b" : "#94a3b8"; }}
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
