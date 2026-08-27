import { cn } from "@/lib/utils";

export function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T | null | undefined;
  onChange: (id: T) => void;
  columns?: 2 | 3 | 4;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">{legend}</legend>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-4",
        )}
      >
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                "min-h-11 rounded-[var(--radius-sm)] px-3 text-left text-sm shadow-[var(--shadow-border)] transition-[box-shadow,background-color,color] duration-150",
                on ? "bg-accent text-accent-fg" : "bg-elevated text-fg hover:shadow-[var(--shadow-border-hover)]",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
