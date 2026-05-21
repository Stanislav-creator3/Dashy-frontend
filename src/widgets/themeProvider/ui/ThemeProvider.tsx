"use client";

import { useEffect } from "react";
import { useSetResolvedTheme, useTheme } from "../model/store";

export default function ThemeProvider() {
  const theme = useTheme();
  const setResolvedTheme = useSetResolvedTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const isDark = theme === "dark" || (theme === "system" && media.matches);
      document.documentElement.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    applyTheme();
    media.addEventListener("change", applyTheme);

    return () => media.removeEventListener("change", applyTheme);
  }, [theme]);

  return null;
}
