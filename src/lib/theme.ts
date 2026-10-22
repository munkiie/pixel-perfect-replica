export type Theme = "light" | "dark";

const STORAGE_KEY = "icc-theme";

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage unavailable — the choice just won't persist.
  }
}

export function storedTheme(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // Fall through to the default.
  }
  return "dark";
}

// Runs before first paint via an inline script in the root shell.
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");if(t==="light"){document.documentElement.classList.remove("dark")}else{document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})();`;
