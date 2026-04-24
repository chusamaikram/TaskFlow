export default function Button({ children, variant = "primary", size = "md", className = "", disabled = false, onClick, type = "button" }) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 cursor-pointer border-0 outline-none";
  
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-[#030d12]",
    outline: "!border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 bg-transparent ",
    ghost: "text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 bg-transparent",
    danger: "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30",
    success: "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };

  const glowMap = {
    primary: "0 0 20px rgba(6,182,212,0.35)",
    outline: "none",
    ghost: "none",
    danger: "none",
    success: "none",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      style={!disabled ? { boxShadow: glowMap[variant] } : {}}
      onMouseEnter={(e) => { if (variant === "primary" && !disabled) e.target.style.boxShadow = "0 0 30px rgba(6,182,212,0.5)"; }}
      onMouseLeave={(e) => { if (variant === "primary" && !disabled) e.target.style.boxShadow = glowMap[variant]; }}
    >
      {children}
    </button>
  );
}
