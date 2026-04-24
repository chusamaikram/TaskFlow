import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("taskflow_theme");
    return saved ? saved === "dark" : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("light");
      root.classList.add("dark");
      document.body.style.backgroundColor = "#030d12";
      document.body.style.color = "#f1f5f9";
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      document.body.style.backgroundColor = "#f1f5f9";
      document.body.style.color = "#0f172a";
    }
    localStorage.setItem("taskflow_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
