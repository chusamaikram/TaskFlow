import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Zap, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ThemeToggle from "../components/ui/ThemeToggle";
import GoogleButton from "../components/ui/GoogleButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.code === "auth/user-not-found"      ? "No account found with this email." :
        err.code === "auth/wrong-password"       ? "Incorrect password." :
        err.code === "auth/invalid-credential"   ? "Invalid email or password." :
        "Failed to sign in. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") return;
      const msg =
        err.code === "auth/unauthorized-domain" ? "This domain is not authorized. Contact support." :
        "Google sign in failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 grid-bg bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 light:bg-slate-100">
      <div className="pointer-events-none fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] opacity-25 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="fixed top-5 right-5"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-500 shadow-cyan-lg">
              <Zap size={20} className="text-dark-900" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold font-display text-slate-100 light:text-slate-900">TaskFlow</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2 font-display text-slate-100 light:text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500 light:text-slate-500">Sign in to continue to your workspace</p>
        </div>

        <div className="rounded-2xl p-8 bg-cyan-500/[0.04] border border-cyan-500/15 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] light:bg-white/80 light:border-slate-200">
          <GoogleButton onClick={handleGoogle} />

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/[0.06] light:bg-black/[0.08]" />
            <span className="text-xs font-mono text-slate-500">or</span>
            <div className="flex-1 h-px bg-white/[0.06] light:bg-black/[0.08]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Email address" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} icon={Mail} required />

            <div className="relative">
              <Input label="Password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} icon={Lock} required />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 bottom-3 text-slate-500 hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-cyan-400 transition-colors">Forgot password?</Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-current/40 border-t-current rounded-full animate-spin" />Signing in...</span> : "Sign in"}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}
