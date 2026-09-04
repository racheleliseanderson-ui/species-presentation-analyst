import { PlateDepthControl, PresentationPathPlate } from "@/lib/field-plates";
import { motionFor } from "@/lib/knowledge/presentation-motion";
import { labelOf } from "@/lib/protocol/vocab";
import type { ForageClass } from "@/lib/protocol/vocab";
import type { RankedPresentation } from "@/lib/protocol/types";

/**
 * The leading family, drawn as the mechanical task it actually is.
 *
 * The reading already names a family and lists its mechanics. Both are
 * accurate and neither answers the question somebody standing in the water is
 * asking, which is: how deep, how fast, and what is the thing supposed to be
 * doing between the cast and the retrieve. A list of phrases does not settle
 * that. A drawing does.
 *
 * It is still not a lure recommendation. Anything that can perform the task
 * in the picture will do, and plenty of things sold for exactly this job
 * cannot.
 */
export function PresentationJobPlate({
  presentation,
  forageClasses,
  forageCertainty,
  briefFor,
}: {
  presentation: RankedPresentation;
  forageClasses: ForageClass[];
  forageCertainty: "high" | "moderate" | "low";
  /**
   * What this brief was worked out for — the species, and the conditions the
   * reader stated. It exists because the plate can now be saved as a picture,
   * and a picture of six mechanical values with nothing saying what they were
   * for is the sort of note you find in a camera roll a month later and
   * delete. On the screen it is one quiet line; on the card it is the whole
   * difference between a record and a screenshot.
   */
  briefFor?: string | undefined;
}) {
  const motion = motionFor(presentation.id);
  if (!motion) return null;

  const forage = forageClasses;
  const profile =
    forage.length === 0
      ? undefined
      : `${forage.map((f) => labelOf(f)).join(", ")}${
          forageCertainty === "low" ? " — declared, not observed" : ""
        }`;

  return (
    <div className="hthp-stack">
      {/* Beside the drawing rather than in a settings drawer: it changes what
          is on this screen, and a control for that belongs next to it. */}
      <PlateDepthControl />
      <PresentationPathPlate
      eyebrow="Presentation brief · the job, not the lure"
      job={{ ...motion, profile }}
      title={`${presentation.label} — what it has to do`}
      caption={briefFor ? `${briefFor}. ${presentation.job}` : presentation.job}
      testid="presentation-job-plate"
      unknown={
        forage.length === 0
          ? "No forage class was declared, so the profile line is empty. That does not change the path, the depth or the speed — it changes what you hang on the end of it."
          : undefined
      }
      aside={
        <>
          <p>
            <b>What it costs you.</b> {motion.costs}
          </p>
          <p>
            <b>What tells you it is working.</b> {motion.tell}
          </p>
          <p>
            The drawing is the task, not the tackle. If something in your box can be made to travel
            that path at that speed and hold that depth, it can do this job — and a thing sold for
            this exact job that cannot hold the depth is the wrong tool with the right label.
          </p>
        </>
      }
      />
    </div>
  );
}

/**
 * The one-line version, for the runner-up cards where a second full plate
 * would be noise rather than information.
 */
export function JobLine({ presentation }: { presentation: RankedPresentation }) {
  const motion = motionFor(presentation.id);
  if (!motion) return null;
  return (
    <dl className="mt-3 grid gap-x-4 gap-y-1 text-xs sm:grid-cols-2">
      <div className="flex gap-2">
        <dt className="font-mono uppercase tracking-[0.12em] text-dim">Costs</dt>
        <dd className="text-muted">{motion.costs}</dd>
      </div>
      <div className="flex gap-2">
        <dt className="font-mono uppercase tracking-[0.12em] text-dim">Tell</dt>
        <dd className="text-muted">{motion.tell}</dd>
      </div>
    </dl>
  );
}
