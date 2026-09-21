export type ThemePreference = "light" | "dark" | "system";

const KEY = "nutriai:theme";

export function getThemePreference(): ThemePreference {
  const stored = localStorage.getItem(KEY);
  return stored === "light" || stored === "dark" ? stored : "system";
}

export function setThemePreference(pref: ThemePreference): void {
  if (pref === "system") {
    localStorage.removeItem(KEY);
  } else {
    localStorage.setItem(KEY, pref);
  }
  applyTheme(pref);
}

export function applyTheme(pref: ThemePreference): void {
  const dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0b0d10" : "#f5f7f8");
}
