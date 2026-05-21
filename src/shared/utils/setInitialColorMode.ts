export const setInitialColorMode = `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const theme = stored ? JSON.parse(stored) : "system";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark =
      theme === "dark" ||
      (theme === "system" && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})(); `;
