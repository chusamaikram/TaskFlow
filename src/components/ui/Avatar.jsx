export default function Avatar({ name, size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-14 h-14 text-xl",
    xl: "w-20 h-20 text-3xl",
  };
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold flex-shrink-0 font-display text-dark-900 shadow-cyan ${sizes[size]} ${className}`}
      style={{ background: "linear-gradient(135deg, #0e7490, #06b6d4)" }}
    >
      {initials}
    </div>
  );
}
