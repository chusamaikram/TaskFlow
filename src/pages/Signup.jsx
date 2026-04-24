import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";
import GoogleButton from "../components/ui/GoogleButton";
import { useTheme } from "../context/ThemeContext";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error("All fields are required."); return; }

    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(form.email)) { toast.error("Please enter a valid email address."); return; }

    if (form.password !== form.confirm) { toast.error("Passwords do not match."); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      setDone(true);
      toast.success("Account created! Check your email to verify. 📧");
    } catch (err) {
      const msg =
        err.code === "auth/email-already-in-use" ? "Email is already registered." :
        err.code === "auth/invalid-email"         ? "Invalid email address." :
        "Failed to create account.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed up with Google!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Google error:", err.code, err.message);
      const msg =
        err.code === "auth/popup-blocked"        ? "Popup was blocked. Please allow popups for this site." :
        err.code === "auth/popup-closed-by-user" ? "Sign in cancelled." :
        err.code === "auth/unauthorized-domain"  ? "This domain is not authorized. Contact support." :
        "Google sign in failed. Please try again.";
      toast.error(msg);
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
        className="pointer-events-none fixed top-1/4 right-1/4 w-[400px] h-[400px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)" }}
      />
      <div className="fixed top-5 right-5"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#06b6d4", boxShadow: "0 0 20px rgba(6,182,212,0.4)" }}>
              <Zap size={20} color="#030d12" fill="#030d12" />
            </div>
            <span className="text-2xl font-bold" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
              TaskFlow
            </span>
          </Link>
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            Create account
          </h1>
          <p style={{ color: isDark ? "#64748b" : "#475569", fontSize: "0.9rem" }}>
            Start organizing your work today
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: isDark ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.8)",
            border: "1px solid rgba(6,182,212,0.15)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(6,182,212,0.06)",
          }}
        >
          {done ? (
            <div className="text-center py-4 space-y-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)" }}
              >
                <Mail size={26} style={{ color: "#34d399" }} />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
                  Verify your email
                </h3>
                <p className="text-sm" style={{ color: isDark ? "#64748b" : "#475569" }}>
                  We sent a verification link to
                </p>
                <p className="text-sm font-semibold mt-1" style={{ color: "#06b6d4" }}>{form.email}</p>
              </div>
              <p className="text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>
                Click the link in your email, then sign in.
              </p>
              <Button className="w-full" size="lg" onClick={() => navigate("/login")}>
                Go to Sign In
              </Button>
            </div>
          ) : (
            <>
              <GoogleButton onClick={handleGoogle} />

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }} />
                <span className="text-xs font-mono" style={{ color: isDark ? "#475569" : "#94a3b8" }}>or</span>
                <div className="flex-1 h-px" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)" }} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Full Name" placeholder="John Doe" value={form.name} onChange={(e) => set("name", e.target.value)} icon={User} required />
                <Input label="Email address" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set("email", e.target.value)} icon={Mail} required />
                <Input label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => set("password", e.target.value)} icon={Lock} required />
                <Input label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={(e) => set("confirm", e.target.value)} icon={Lock} required />

                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : "Create account"}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: isDark ? "#64748b" : "#475569" }}>
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
