"use client";

import { useThemeStore } from "@/widgets/themeProvider/model/store";

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme, setTheme } = useThemeStore();

  const onToggleTheme = () => {
    toggleTheme();
  };

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="glass-button px-3 py-2 rounded-xl"
      >
        {resolvedTheme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
      <button
        onClick={() => setTheme("system")}
        className="glass-button px-3 py-2 rounded-xl"
      >
        System
      </button>
    </div>
  );
}
