import { useNavigate } from "react-router-dom";
import { CheckCircle2, Layers, ArrowRight, Star, Shield, BarChart3, Zap } from "lucide-react";
import Button from "../components/ui/Button";
import LandingHeader from "../components/layout/LandingHeader";

const FEATURES = [
  { icon: CheckCircle2, title: "Smart Task Tracking",  desc: "Organize tasks by status, priority, and category with a clean visual interface.", color: "#06b6d4" },
  { icon: Layers,       title: "Project Boards",       desc: "Visualize work across todo, in-progress, and done columns instantly.",           color: "#818cf8" },
  { icon: BarChart3,    title: "Progress Insights",    desc: "See your completion rate, upcoming deadlines, and workload at a glance.",        color: "#34d399" },
  { icon: Shield,       title: "Secure & Private",     desc: "Your data stays yours. Encrypted sessions with full privacy controls.",          color: "#f59e0b" },
];

const TESTIMONIALS = [
  { name: "Sarah K.",   role: "Product Manager",  text: "TaskFlow changed how my team operates. Clean, fast, no fluff.",                    stars: 5 },
  { name: "Marcus T.",  role: "Senior Engineer",  text: "Finally a task app that doesn't feel like bloatware. Love the dark theme.",         stars: 5 },
  { name: "Priya M.",   role: "Startup Founder",  text: "Went from chaos to clarity in one afternoon. Highly recommend.",                    stars: 5 },
];

const STATS = [
  { label: "Total Tasks", value: "24", color: "#06b6d4" },
  { label: "Completed",   value: "18", color: "#34d399" },
  { label: "In Progress", value: "4",  color: "#818cf8" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid-bg bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 light:bg-gradient-to-br light:from-sky-50 light:via-blue-50 light:to-sky-50">
      {/* Ambient glows */}
      <div className="pointer-events-none fixed top-0 left-1/4 w-[600px] h-[600px] opacity-30 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <div className="pointer-events-none fixed bottom-0 right-1/4 w-[400px] h-[400px] opacity-20 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(129,140,248,0.2) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <LandingHeader />

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-20 pb-20 sm:pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-mono bg-cyan-500/10 border border-cyan-500/25 text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Now with AI-powered task suggestions
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-tight mb-6 font-display text-slate-100 light:text-slate-900 tracking-tight">
          Work smarter,<br />
          <span className="text-cyan-500" style={{ textShadow: "0 0 40px rgba(6,182,212,0.4)" }}>not harder.</span>
        </h1>

        <p className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed text-slate-400 light:text-slate-600">
          TaskFlow is the modern productivity suite for teams and individuals who refuse to settle.
          Organize tasks, track progress, and ship with confidence.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button onClick={() => navigate("/signup")} size="lg">Start for free <ArrowRight size={18} /></Button>
          <Button variant="outline" onClick={() => navigate("/login")} size="lg">Sign in</Button>
        </div>

        {/* Hero preview card */}
        <div className="mt-16 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-cyan-500/20 shadow-[0_0_80px_rgba(6,182,212,0.12),0_40px_80px_rgba(0,0,0,0.5)]">
          <div className="px-4 py-3 flex items-center gap-2 bg-dark-800 border-b border-cyan-500/10">
            <span className="w-3 h-3 rounded-full bg-rose-500/70" />
            <span className="w-3 h-3 rounded-full bg-amber-500/70" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
            <span className="text-xs text-slate-600 ml-2 font-mono">taskflow.io/dashboard</span>
          </div>
          <div className="p-4 sm:p-6 grid grid-cols-3 gap-3 sm:gap-4 bg-gradient-to-b from-dark-800 to-dark-900">
            {STATS.map((s) => (
              <div key={s.label} className="card text-center py-4">
                <div className="text-xl sm:text-2xl font-bold mb-1 font-display" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-500 font-mono uppercase tracking-wider hidden sm:block">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-12 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display text-slate-100 light:text-slate-900">
            Everything you need.<span className="text-cyan-500"> Nothing you don't.</span>
          </h2>
          <p className="text-slate-500 light:text-slate-500">Built for focus. Designed for speed.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="card group hover:scale-[1.02] transition-transform duration-200">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 className="font-bold mb-2 font-display text-slate-100 light:text-slate-900">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500 light:text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12 font-display text-slate-100 light:text-slate-900">
          Loved by teams worldwide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="card">
              <div className="flex gap-0.5 mb-3">
                {Array(t.stars).fill(0).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm mb-4 italic leading-relaxed text-slate-400 light:text-slate-500">"{t.text}"</p>
              <div>
                <p className="text-sm font-semibold font-display text-slate-200 light:text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-20 text-center">
        <div className="card py-12 sm:py-16 px-6 sm:px-8 bg-gradient-to-br from-cyan-500/[0.08] to-indigo-500/[0.05] border-cyan-500/20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display text-slate-100 light:text-slate-900">Ready to get organized?</h2>
          <p className="text-slate-400 mb-8">Join thousands of teams already using TaskFlow.</p>
          <Button size="lg" onClick={() => navigate("/signup")}>Create your free account <ArrowRight size={18} /></Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-cyan-500/[0.08] text-center py-8">
        <p className="text-slate-600 text-sm font-mono">© 2024 TaskFlow — Built with <Zap size={12} className="inline text-cyan-500" /> and caffeine</p>
      </footer>
    </div>
  );
}
