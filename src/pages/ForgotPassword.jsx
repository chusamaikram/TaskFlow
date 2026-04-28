import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Zap, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";

const EMAIL_RE = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim())          { toast.error("Please enter your email address."); return; }
    if (!EMAIL_RE.test(email))  { toast.error("Please enter a valid email address."); return; }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSent(true);
      toast.success("Reset email sent!");
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"    ? "No account found with this email." :
        err.code === "auth/invalid-email"     ? "Invalid email address." :
        err.code === "auth/too-many-requests" ? "Too many attempts. Please try again later." :
        "Failed to send reset email. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg bg-slate-100 dark:bg-gradient-to-br dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-20 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="fixed top-5 right-5"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500 shadow-cyan-lg">
              <Zap size={20} className="text-dark-900" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100">TaskFlow</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2 font-display text-slate-900 dark:text-slate-100">Reset password</h1>
          <p className="text-sm text-slate-500">Enter your email and we'll send you a reset link</p>
        </div>

        <div className="rounded-2xl p-8 bg-white/90 border border-slate-200 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] dark:bg-cyan-500/[0.04] dark:border-cyan-500/15 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          {sent ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-emerald-500/12 border border-emerald-500/25">
                <CheckCircle2 size={26} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1 font-display text-slate-900 dark:text-slate-100">Check your inbox</h3>
                <p className="text-sm text-slate-500">We sent a password reset link to</p>
                <p className="text-sm font-semibold mt-1 text-cyan-500">{email}</p>
              </div>
              <div className="rounded-xl p-4 text-left space-y-2 bg-black/[0.03] border border-slate-200 dark:bg-white/[0.03] dark:border-white/[0.06]">
                <p className="text-xs font-semibold text-slate-400">What to do next:</p>
                {["Open the email from TaskFlow", 'Click the "Reset password" link', "Choose a new strong password", "Sign in with your new password"].map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 bg-cyan-500/15 text-cyan-500 font-mono">{i + 1}</span>
                    <p className="text-xs text-slate-500">{step}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Didn't receive it? Check your spam or{" "}
                <button onClick={() => setSent(false)} className="font-semibold text-cyan-500 hover:text-cyan-400 transition-colors">try again</button>
              </p>
              <Button className="w-full" size="lg" onClick={() => navigate("/login")}>Back to Sign In</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />
              <Button type="submit" disabled={loading} className="w-full" size="lg">
                {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />Sending...</span> : "Send reset link"}
              </Button>
            </form>
          )}
        </div>

        {!sent && (
          <div className="text-center mt-6">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors">
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
