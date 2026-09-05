import type { SpeciesImageRecord } from "@/lib/knowledge/species-images";
import { SPECIES_IMAGE_LADDERS } from "@/lib/knowledge/species-image-ladders";

/**
 * The reviewed photograph, on the page, at last.
 *
 * Nineteen species in this catalog carry a photograph that was sourced from a
 * named agency, checked against diagnostic features by a person, and recorded
 * with its creator and its licence. Until now the only place any of it appeared
 * was an 80-pixel slot beside the headline and a social share card — so the one
 * question a reader arrives at a species page holding, *is this the fish I am
 * looking at*, was answered by a thumbnail the size of a postage stamp.
 *
 * Three things this figure does that a bare `<img>` would not:
 *
 * **It offers the size the device actually needs.** `srcset` and `sizes` mean a
 * phone downloads a 400-pixel rung — five to thirty kilobytes — where before
 * the only file on the page above thumbnail size was up to 288 kB and was not
 * on the page at all.
 *
 * **It reserves its own space.** The intrinsic dimensions come from the
 * generated ladder, so the column does not jump when the picture lands. On a
 * bad connection that jump happens exactly when somebody has started reading.
 *
 * **It arrives with its limits attached.** The `visualQa` note is not a
 * technical field kept for the reviewer — it is the sentence saying what this
 * photograph is evidence OF, and, more often than not, what it is not evidence
 * of: a species-level illustration standing in for a landlocked life history,
 * a background fish that is context rather than subject. Every other species
 * site publishes a confident picture. This one publishes the picture and the
 * caveat in the same frame, which is the same reason the unknowns sit above the
 * biology on this page.
 */

const TYPE_LABEL: Record<SpeciesImageRecord["imageType"], string> = {
  photograph: "Photograph",
  field_photograph: "Field photograph",
  specimen_photograph: "Specimen photograph",
  scientific_illustration: "Scientific illustration",
};

const BASIS_LABEL: Record<NonNullable<SpeciesImageRecord["identificationBasis"]>, string> = {
  authoritative_source: "Identified by the publishing body",
  visual_review: "Identified on review of diagnostic features",
};

/** `/species/<slug>/canonical.webp` -> `/species/<slug>` */
function dirOf(canonical: string): string {
  return canonical.slice(0, canonical.lastIndexOf("/"));
}

export function SpeciesPhotograph({
  image,
  commonName,
  scientificName,
}: {
  image: SpeciesImageRecord;
  commonName: string;
  scientificName: string;
}) {
  const dir = dirOf(image.canonical);
  const slug = dir.slice(dir.lastIndexOf("/") + 1);
  const ladder = SPECIES_IMAGE_LADDERS[slug];

  /*
   * No ladder entry means the derivatives have not been generated for this
   * picture yet. Serve the one file that certainly exists rather than a broken
   * `srcset` — a missing rung must degrade to a heavier image, never to no
   * image.
   */
  const candidates = ladder?.widths ?? [];
  const srcSet = candidates
    .map((width) => {
      const file = width === ladder?.intrinsic.width ? "canonical.webp" : `w${width}.webp`;
      return `${dir}/${file} ${width}w`;
    })
    .join(", ");

  return (
    /*
     * Narrower than the page's own measure on purpose. At the full 5xl column
     * a 3:2 photograph is 976 x 650 and swallows the first screen of a
     * document whose whole argument is that the unknowns come before the
     * biology. It is NOT cropped to get there — this is an identification
     * record, and a diagnostic feature can sit anywhere in the frame, so the
     * height comes off by making the picture narrower rather than by cutting
     * anything out of it.
     */
    <figure className="mt-8 max-w-3xl">
      <div className="overflow-hidden rounded-[var(--radius-lg)] bg-subtle shadow-[var(--shadow-border)]">
        <img
          src={image.canonical}
          {...(srcSet ? { srcSet } : {})}
          /* One column, capped by the page's own measure. Below 640 the figure
             is the full viewport; above it, the figure's own 48rem cap. */
          sizes="(max-width: 640px) 100vw, min(100vw, 48rem)"
          width={ladder?.intrinsic.width}
          height={ladder?.intrinsic.height}
          alt={`${commonName} (${scientificName}). ${TYPE_LABEL[image.imageType]} published by ${image.sourceOrg}.`}
          /* Eager, and prioritised. This is the page's largest paint and it sits
             directly under the headline — deferring it means the one element a
             reader came to look at is the last thing to arrive. Everything else
             on this document is text the server already rendered. */
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="block h-auto w-full"
        />
      </div>

      <figcaption className="mt-3 space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-mark">
          {TYPE_LABEL[image.imageType]} · reviewed {image.reviewedAt}
        </p>
        {/*
         * The caveat, in the caption, not folded away behind a control. What a
         * picture cannot show is never hidden on this page — the same rule the
         * plate kit holds for its drawings.
         */}
        <p className="max-w-2xl text-sm leading-relaxed text-muted">{image.visualQa}</p>
        <p className="max-w-2xl text-xs leading-relaxed text-dim">
          {image.creator} · {image.sourceOrg} · {image.license}
          {image.identificationBasis ? ` · ${BASIS_LABEL[image.identificationBasis]}` : ""}{" "}
          <a
            href={image.sourcePage}
            rel="noreferrer"
            target="_blank"
            className="text-muted underline decoration-line underline-offset-2"
          >
            Source
          </a>
        </p>
      </figcaption>
    </figure>
  );
}
