import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!isOpen) return null;

  const sizeMap = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-slate-900/50 dark:bg-dark-900/85 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full ${sizeMap[size]} animate-slide-up flex flex-col max-h-[calc(100vh-4rem)] rounded-2xl bg-white border border-slate-200 shadow-[0_24px_64px_rgba(0,0,0,0.12)] dark:bg-[#0b1e2d] dark:border-cyan-500/15 dark:shadow-[0_0_60px_rgba(6,182,212,0.08),0_24px_64px_rgba(0,0,0,0.6)]`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 flex-shrink-0 border-b border-slate-100 dark:border-white/[0.06]">
          <h2 className="text-base font-bold font-display text-slate-900 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors"
          >
            <X size={17} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 modal-scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
