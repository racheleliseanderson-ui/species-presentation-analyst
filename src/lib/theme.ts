export const THEMES = [
  { id: "dark", n: "01", label: "Dark" },
  { id: "light", n: "02", label: "Light" },
  { id: "atelier", n: "03", label: "Atelier" },
  { id: "bw", n: "04", label: "B/W" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const KEY = "hth-sp-theme";

export function readTheme(): ThemeId {
  if (typeof window === "undefined") return "dark";
  const v = window.localStorage.getItem(KEY);
  if (v === "dark" || v === "light" || v === "atelier" || v === "bw") return v;
  return "dark";
}

export function applyTheme(id: ThemeId) {
  document.documentElement.setAttribute("data-theme", id);
  try {
    window.localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}
