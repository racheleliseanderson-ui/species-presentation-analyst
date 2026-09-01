/**
 * Appearance is one setting with three values, exposed through a single
 * floating control (see `src/components/appearance-control.tsx`).
 *
 * `colorsafe` is the accessibility mode: a high-contrast, low-chroma palette
 * that carries no red/green distinction, so nothing in the reading depends on
 * telling two hues apart. It is not a fourth decorative theme.
 */
export const THEMES = [
  {
    id: "dark",
    label: "Dark",
    hint: "Low-glare palette for dawn, dusk and night.",
  },
  {
    id: "light",
    label: "Light",
    hint: "Paper-toned palette for bright water and daylight screens.",
  },
  {
    id: "colorsafe",
    label: "Color-safe",
    hint: "High-contrast, color-blind-safe palette. Nothing is signalled by hue alone.",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

export const THEME_STORAGE_KEY = "hth-sp-theme";
export const DEFAULT_THEME: ThemeId = "dark";

/**
 * Earlier builds shipped `atelier` (a second paper theme) and `bw`. Anyone who
 * chose one still has it in local storage, so map rather than silently reset.
 */
const LEGACY: Record<string, ThemeId> = {
  atelier: "light",
  bw: "colorsafe",
};

export function normalizeTheme(value: unknown): ThemeId | null {
  if (typeof value !== "string") return null;
  if (THEMES.some((theme) => theme.id === value)) return value as ThemeId;
  return LEGACY[value] ?? null;
}

export function readTheme(): ThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY)) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function applyTheme(id: ThemeId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", id);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, id);
  } catch {
    /* device storage unavailable */
  }
}

/**
 * Runs before paint so a stored choice never flashes through the dark default.
 * Kept in sync with `LEGACY` above — the mapping has to happen here too, or a
 * legacy value would paint as dark for one frame before React corrects it.
 */
export const THEME_BOOT_SCRIPT = `try{var m={atelier:'light',bw:'colorsafe'};var t=localStorage.getItem('${THEME_STORAGE_KEY}');t=m[t]||t;if(t==='dark'||t==='light'||t==='colorsafe')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;
