import { useNavigate } from "react-router-dom";
import { Zap, CheckCircle2, Layers, ArrowRight, Star, Shield, BarChart3 } from "lucide-react";
import Button from "../components/ui/Button";
import LandingHeader from "../components/layout/LandingHeader";
import { useTheme } from "../context/ThemeContext";

const features = [
  { icon: CheckCircle2, title: "Smart Task Tracking", desc: "Organize tasks by status, priority, and category with a clean visual interface.", color: "#06b6d4" },
  { icon: Layers, title: "Project Boards", desc: "Visualize work across todo, in-progress, and done columns instantly.", color: "#818cf8" },
  { icon: BarChart3, title: "Progress Insights", desc: "See your completion rate, upcoming deadlines, and workload at a glance.", color: "#34d399" },
  { icon: Shield, title: "Secure & Private", desc: "Your data stays yours. Encrypted sessions with full privacy controls.", color: "#f59e0b" },
];

const testimonials = [
  { name: "Sarah K.", role: "Product Manager", text: "TaskFlow changed how my team operates. Clean, fast, no fluff.", stars: 5 },
  { name: "Marcus T.", role: "Senior Engineer", text: "Finally a task app that doesn't feel like bloatware. Love the dark theme.", stars: 5 },
  { name: "Priya M.", role: "Startup Founder", text: "Went from chaos to clarity in one afternoon. Highly recommend.", stars: 5 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  return (
    <div
      className="min-h-screen grid-bg"
      style={{
        background: isDark
          ? "linear-gradient(135deg, #030d12 0%, #061520 60%, #030d12 100%)"
          : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 60%, #f0f9ff 100%)",
      }}
    >
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[600px] h-[600px] opacity-30"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[400px] h-[400px] opacity-20"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <LandingHeader />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-24 text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-mono"
          style={{ background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.25)", color: "#22d3ee" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Now with AI-powered task suggestions
        </div>

        <h1
          className="text-6xl md:text-7xl font-black leading-tight mb-6"
          style={{
            fontFamily: "'Syne', sans-serif",
            color: isDark ? "#f1f5f9" : "#0f172a",
            letterSpacing: "-0.02em",
          }}
        >
          Work smarter,
          <br />
          <span style={{ color: "#06b6d4", textShadow: "0 0 40px rgba(6,182,212,0.4)" }}>
            not harder.
          </span>
        </h1>

        <p
          className="text-lg max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ color: isDark ? "#94a3b8" : "#475569" }}
        >
          TaskFlow is the modern productivity suite for teams and individuals who refuse to settle.
          Organize tasks, track progress, and ship with confidence.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button onClick={() => navigate("/signup")} size="lg">
            Start for free <ArrowRight size={18} />
          </Button>
          <Button variant="outline" onClick={() => navigate("/login")} size="lg">
            Sign in
          </Button>
        </div>


        {/* Hero card preview */}
        <div
          className="mt-16 mx-auto max-w-3xl rounded-2xl overflow-hidden"
          style={{
            border: "1px solid rgba(6,182,212,0.2)",
            boxShadow: "0 0 80px rgba(6,182,212,0.12), 0 40px 80px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="px-4 py-3 flex items-center gap-2"
            style={{ background: "#061520", borderBottom: "1px solid rgba(6,182,212,0.1)" }}
          >
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="text-xs text-slate-600 ml-2 font-mono">taskflow.io/dashboard</span>
          </div>
          <div
            className="p-6 grid grid-cols-3 gap-4"
            style={{ background: "linear-gradient(180deg, #061520 0%, #030d12 100%)" }}
          >
            {[
              { label: "Total Tasks", value: "24", color: "#06b6d4" },
              { label: "Completed", value: "18", color: "#34d399" },
              { label: "In Progress", value: "4", color: "#818cf8" },
            ].map((stat) => (
              <div key={stat.label} className="card text-center py-4">
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Syne', sans-serif", color: stat.color }}>
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
            Everything you need.
            <span style={{ color: "#06b6d4" }}> Nothing you don't.</span>
          </h2>
          <p style={{ color: isDark ? "#64748b" : "#475569" }}>
            Built for focus. Designed for speed.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card group hover:scale-[1.02] transition-transform duration-200">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-bold mb-2" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: isDark ? "#64748b" : "#475569" }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#0f172a" }}>
          Loved by teams worldwide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <div className="flex gap-0.5 mb-3">
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} style={{ color: "#fbbf24", fill: "#fbbf24" }} />)}
              </div>
              <p className="text-sm mb-4 italic leading-relaxed" style={{ color: isDark ? "#94a3b8" : "#475569" }}>"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#e2e8f0" : "#0f172a" }}>{t.name}</p>
                <p className="text-xs" style={{ color: isDark ? "#475569" : "#94a3b8" }}>{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 py-20 text-center">
        <div
          className="card py-16 px-8"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(129,140,248,0.05) 100%)",
            border: "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Syne', sans-serif", color: isDark ? "#f1f5f9" : "#000" }}>
            Ready to get organized?
          </h2>
          <p className="text-slate-400 mb-8">Join thousands of teams already using TaskFlow.</p>
          <Button size="lg" onClick={() => navigate("/signup")}>
            Create your free account <ArrowRight size={18} />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t text-center py-8" style={{ borderColor: "rgba(6,182,212,0.08)" }}>
        <p className="text-slate-600 text-sm font-mono">
          © 2024 TaskFlow — Built with ⚡ and caffeine
        </p>
      </footer>
    </div>
  );
}
