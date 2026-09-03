import { useEffect, useRef, useState } from "react";
import { Check, Contrast, Moon, Sun, X } from "lucide-react";
import { applyTheme, readTheme, THEMES, type ThemeId } from "@/lib/theme";
import { FIELD_MODE_LABEL, FIELD_MODE_NOTE, useFieldMode } from "@/lib/field-mode";
import { cn } from "@/lib/utils";

/**
 * The single appearance / accessibility control for the whole app.
 *
 * There is deliberately only one of these, and it is mounted once in the root
 * document rather than per page: a second appearance switch in the header meant
 * two controls could disagree about what was selected, and neither announced
 * itself to assistive technology as the app-wide setting.
 */

const ICONS: Record<ThemeId, typeof Sun> = {
  dark: Moon,
  light: Sun,
  colorsafe: Contrast,
};

export function AppearanceControl() {
  const [theme, setTheme] = useState<ThemeId>("dark");
  const { setting: fieldSetting, set: setFieldMode } = useFieldMode();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stored = readTheme();
    setTheme(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (rootRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  // Rendering the panel before the stored value is read would show "Dark"
  // selected for a light-mode reader for one frame.
  if (!mounted) return null;

  const choose = (next: ThemeId) => {
    setTheme(next);
    applyTheme(next);
  };

  const ActiveIcon = ICONS[theme];
  const active = THEMES.find((item) => item.id === theme);

  return (
    <div
      ref={rootRef}
      className="no-print fixed bottom-24 right-4 z-30 flex flex-col items-end gap-2 lg:bottom-5 lg:right-5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {open && (
        <div
          id="appearance-panel"
          role="group"
          aria-label="Appearance and accessibility"
          className="max-h-[70dvh] w-[min(19rem,calc(100vw-2rem))] overflow-y-auto rounded-[var(--radius-md)] bg-elevated p-3 shadow-[var(--shadow-border-hover)]"
        >
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Appearance</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close appearance settings"
              className="-mr-1 -mt-1 grid size-8 place-items-center rounded-[var(--radius-xs)] text-dim hover:bg-subtle hover:text-fg"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Reading mode lives with appearance because it is an appearance
              decision made about a place rather than a preference. */}
          <div className="mt-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">Reading</p>
            <div
              className="mt-2 grid grid-cols-3 gap-1.5"
              role="radiogroup"
              aria-label="Reading mode"
            >
              {(["off", "auto", "on"] as const).map((m) => {
                const on = fieldSetting === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFieldMode(m)}
                    className={cn(
                      "min-h-11 rounded-[var(--radius-sm)] px-2 text-xs font-medium shadow-[var(--shadow-border)]",
                      on ? "bg-accent text-accent-fg" : "bg-subtle text-fg",
                    )}
                  >
                    {FIELD_MODE_LABEL[m]}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 px-1 text-xs leading-snug text-dim">
              {FIELD_MODE_NOTE[fieldSetting]}
            </p>
          </div>

          <p className="mt-3 border-t border-[color-mix(in_oklab,currentColor_12%,transparent)] pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
            Ground
          </p>
          <div
            className="mt-2 flex flex-col gap-1.5"
            role="radiogroup"
            aria-label="Appearance mode"
          >
            {THEMES.map((item) => {
              const Icon = ICONS[item.id];
              const on = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => choose(item.id)}
                  className={cn(
                    "flex min-h-12 w-full items-start gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-left shadow-[var(--shadow-border)]",
                    on
                      ? "bg-accent text-accent-fg"
                      : "bg-subtle text-fg hover:shadow-[var(--shadow-border-hover)]",
                  )}
                >
                  <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs leading-snug",
                        on ? "text-accent-fg/80" : "text-muted",
                      )}
                    >
                      {item.hint}
                    </span>
                  </span>
                  {on && <Check className="mt-0.5 size-4 shrink-0" aria-hidden />}
                </button>
              );
            })}
          </div>

          <p className="mt-2 px-1 text-xs leading-snug text-dim">
            Saved on this device. Reduced motion follows your system setting automatically.
          </p>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="appearance-panel"
        aria-label={`Appearance and accessibility — ${active?.label ?? "Dark"} selected`}
        title="Appearance and accessibility"
        className="grid size-12 place-items-center rounded-full bg-elevated text-fg shadow-[var(--shadow-border-hover)] hover:bg-subtle"
      >
        <ActiveIcon className="size-5" aria-hidden />
      </button>
    </div>
  );
}
