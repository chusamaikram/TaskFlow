export default function Avatar({ name, size = "md", className = "" }) {
  const sizes = {
    sm: { width: 32, height: 32, fontSize: 12 },
    md: { width: 40, height: 40, fontSize: 14 },
    lg: { width: 56, height: 56, fontSize: 20 },
    xl: { width: 80, height: 80, fontSize: 28 },
  };
  const s = sizes[size];
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div
      className={`rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${className}`}
      style={{
        width: s.width, height: s.height, fontSize: s.fontSize,
        background: "linear-gradient(135deg, #0e7490, #06b6d4)",
        color: "#030d12",
        fontFamily: "'Syne', sans-serif",
        boxShadow: "0 0 15px rgba(6,182,212,0.25)",
      }}
    >
      {initials}
    </div>
  );
}
