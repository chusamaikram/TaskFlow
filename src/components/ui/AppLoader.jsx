import { Zap } from "lucide-react";

export default function AppLoader({ message = "Loading..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-dark-900 light:bg-slate-100">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 opacity-20 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.35) 0%, transparent 70%)", filter: "blur(60px)" }} />

      <div className="relative flex flex-col items-center gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-cyan-500 shadow-cyan-lg animate-pulse">
          <Zap size={26} className="text-dark-900" fill="currentColor" />
        </div>
        <span className="text-2xl font-bold font-display text-slate-100 light:text-slate-900">TaskFlow</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-0.5 rounded-full overflow-hidden bg-white/[0.06] light:bg-slate-200">
          <div className="h-full w-2/5 rounded-full bg-gradient-to-r from-cyan-800 via-cyan-500 to-cyan-300"
            style={{ animation: "loadingBar 1.4s ease-in-out infinite" }} />
        </div>
        <p className="text-xs font-mono text-slate-500">{message}</p>
      </div>

      <style>{`@keyframes loadingBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(350%); } }`}</style>
    </div>
  );
}
