export function Plate({ caption }: { caption: string }) {
  return (
    <figure className="overflow-hidden rounded-[var(--radius-lg)] bg-elevated shadow-[var(--shadow-border)]">
      <div className="plate-seam relative h-40 sm:h-52">
        <div className="absolute inset-y-8 left-[42%] w-px bg-mark/70" />
        <div className="absolute inset-y-12 left-[42%] w-[18%] border-y border-mark/40" />
        <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-[0.18em] text-mark">
          Plate · holding water
        </div>
      </div>
      <figcaption className="border-t border-line px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-dim">
        {caption}
      </figcaption>
    </figure>
  );
}
