import { SPECIES_IMAGES_BY_ID } from "@/lib/knowledge/species-images";
import { cn } from "@/lib/utils";

/**
 * A fixed-size slot for a species record's reviewed image.
 *
 * Only 15 of the 75 reviewed species currently carry a reviewed image, so the
 * previous `image && <img>` pattern left most rows with no slot at all: names
 * sat at different indents, cards collapsed to different heights, and the grid
 * read as half-finished rather than half-reviewed.
 *
 * The slot is therefore always rendered. When a record has no reviewed image we
 * draw a plainly schematic outline instead of a photograph — it marks the space
 * without asserting anything about what this particular species looks like.
 */
export function SpeciesThumb({
  speciesId,
  commonName,
  className,
  decorative = false,
}: {
  speciesId: string;
  commonName: string;
  className?: string;
  decorative?: boolean;
}) {
  const image = SPECIES_IMAGES_BY_ID[speciesId];

  if (image) {
    return (
      <img
        src={image.thumb}
        alt={decorative ? "" : `Reviewed canonical image of ${commonName}`}
        title={`${image.sourceOrg} · ${image.license}`}
        loading="lazy"
        decoding="async"
        className={cn(
          "shrink-0 rounded-[var(--radius-sm)] bg-subtle object-contain p-1 shadow-[var(--shadow-border)]",
          className,
        )}
      />
    );
  }

  return (
    <span
      title={`No reviewed image for ${commonName} yet`}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-subtle shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 40 20"
        aria-hidden="true"
        focusable="false"
        className="h-1/2 w-1/2 text-dim opacity-40"
      >
        <path
          d="M2 10c6-6 14-8 20-8s10 3 12 5c2-2 4-3 4-3v12s-2-1-4-3c-2 2-6 5-12 5S8 16 2 10Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="8.5" r="1" fill="currentColor" />
      </svg>
      {!decorative && <span className="sr-only">No reviewed image for {commonName} yet</span>}
    </span>
  );
}
