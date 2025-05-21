"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = ["light", "dark", "theme-blue", "theme-green", "theme-red"];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // next-themes handles loading the saved theme from localStorage via storageKey prop
    // So, manually setting it here can sometimes cause an extra render or conflict.
    // const savedTheme = localStorage.getItem("portfolio-theme"); // Use the same storageKey
    // if (savedTheme && themes.includes(savedTheme)) {
    //   setTheme(savedTheme);
    // }
  }, []); // Removed setTheme from dependencies to avoid potential loops if not careful

  // Prevents hydration mismatch by only rendering UI on the client
  if (!mounted) {
    return (
      <div className="flex items-center gap-4 p-4 h-[52px]"> {/* Placeholder for SSR to match height */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-transparent">Theme:</span>
          <select className="rounded-md border p-2 opacity-0">
            <option>Loading...</option>
          </select>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4">
      <div className="flex items-center gap-2">
        <span className="text-sm text-text">Theme:</span>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="rounded-md border border-primary bg-background text-text p-2 focus:ring-2 focus:ring-accent focus:border-accent"
          aria-label="Select theme"
        >
          {themes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1).replace("theme-", "")}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
