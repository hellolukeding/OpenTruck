"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored === "dark" || (!stored && prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-1"
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
        {dark ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
