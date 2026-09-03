/**
 * What each presentation family has to *do* in the water.
 *
 * The catalogue already carries a prose `job` and a list of `mechanics`. Both
 * are readable and neither is inspectable: you cannot compare "controlled
 * depth, minimal drag" against "lead the drift, detect ticks" and see what
 * actually differs, and you certainly cannot draw them.
 *
 * So the same job is stated again as six mechanical dimensions — depth, path,
 * speed, pause, contact, and how long the thing stays where a fish can decide
 * about it. Those six are enough to draw the presentation, enough to compare
 * two families honestly, and enough for somebody to hold a lure up against
 * the description and work out whether it can perform the task.
 *
 * This deliberately never names a lure. Two things from different aisles can
 * do the same job, and two things from the same box often cannot.
 *
 * `costs` and `tell` are the parts an angler actually needs and rarely gets:
 * what the presentation gives up to do its job, and what tells you it is
 * working before a fish does.
 */

import type { PresentationId } from "../protocol/types.ts";
import type {
  PathContact,
  PathPause,
  PathShape,
  PathSpeed,
  PresentationJob,
  StrikeWindow,
} from "../field-plates";

export type PresentationMotion = PresentationJob & {
  shape: PathShape;
  speed: PathSpeed;
  pause: PathPause;
  contact: PathContact;
  strikeWindow: StrikeWindow;
  /** What this presentation gives up in order to do its job. */
  costs: string;
  /** What tells you it is working, without needing a fish to say so. */
  tell: string;
};

export const PRESENTATION_MOTION: Record<PresentationId, PresentationMotion> = {
  /* ---------------------------------------------------------------- */
  /* Flowing water                                                     */
  /* ---------------------------------------------------------------- */

  dead_drift: {
    depth: "varies",
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "with",
    costs:
      "Almost no ability to search. A dead drift covers one lane at a time and tells you nothing about the lane beside it.",
    tell: "The line moves at the same speed as the bubbles beside it. Faster and you are dragging; slower and something is holding it back.",
  },
  tight_line_drift: {
    depth: ["mid", "near-bottom"],
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "occasional",
    strikeWindow: "short",
    current: "with",
    costs:
      "Short range. You are fishing where you can keep contact, which is usually much closer than you would like.",
    tell: "A regular soft tick from the bottom. Constant ticking means too deep; nothing at all usually means too light.",
  },
  swing: {
    depth: ["upper", "mid"],
    shape: "swing",
    speed: "slow",
    pause: "brief",
    contact: "none",
    strikeWindow: "medium",
    current: "across",
    costs: "Depth control. The swing decides how deep it fishes; you only get to influence it.",
    tell: "Steady tension the whole way across, then the hang. Slack in the middle means the belly is running the show.",
  },
  suspended_drift: {
    depth: ["mid"],
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "with",
    costs:
      "Bottom-oriented fish. Holding the column means deliberately not fishing the last two feet of it.",
    tell: "It comes back clean. Weed or grit on the hook means it found the bottom you were trying to stay off.",
  },
  bottom_contact_drift: {
    depth: ["near-bottom", "bottom"],
    shape: "drift",
    speed: "slow",
    pause: "none",
    contact: "occasional",
    strikeWindow: "short",
    current: "with",
    costs: "Terminal tackle. This is the family that costs you flies, and the snag rate is the price of the depth.",
    tell: "Occasional contact, not constant. If you are never touching, you are over the fish; if you are always stuck, you are in the rocks.",
  },
  cross_current_retrieve: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "across",
    costs: "Depth. Anything you retrieve across current climbs, and it climbs more the faster you move it.",
    tell: "The rod loads evenly. A sudden lightening usually means the lure has broken the surface film.",
  },
  upstream_retrieve: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "brisk",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "against",
    costs:
      "Everything slow. To keep any action you have to move faster than the current, which rules out a hesitant fish.",
    tell: "You can feel the lure working the whole way back. Lose that feel and you are moving slower than the water.",
  },
  downstream_retrieve: {
    depth: ["mid"],
    shape: "retrieve",
    speed: "slow",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "with",
    costs: "Hookups. Pulling away from a fish that is facing you is the worst angle there is.",
    tell: "The lure holds in the current without being washed back at you.",
  },
  pulse_jig: {
    depth: ["mid", "near-bottom"],
    shape: "jig",
    speed: "moderate",
    pause: "brief",
    contact: "occasional",
    strikeWindow: "short",
    current: "across",
    costs: "Lane coverage. Every hop moves you off the line you were drifting.",
    tell: "The fall is where it happens. If you cannot feel the fall, the jig is too light for the current.",
  },
  surface_drift: {
    depth: "film",
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "with",
    costs: "Everything below the surface, which on most days is where most of the fish are.",
    tell: "The fly sits in the film without a wake behind it. A wake is drag, and drag is a refusal you have not seen yet.",
  },
  wake_skate: {
    depth: "film",
    shape: "surface",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "across",
    costs: "Hookups again, and a lot of refusals you will get to watch.",
    tell: "A clean V behind the fly. If it is submerging or bouncing, the angle is wrong before the fly is.",
  },

  /* ---------------------------------------------------------------- */
  /* Stillwater                                                        */
  /* ---------------------------------------------------------------- */

  stationary_bait: {
    depth: ["bottom"],
    shape: "hold",
    speed: "dead",
    pause: "long",
    contact: "constant",
    strikeWindow: "long",
    current: "none",
    costs: "Search. You are committing to one spot and waiting to find out whether it was the right one.",
    tell: "Nothing, for a long time. This is the family where the honest tell is that you gave it long enough to count.",
  },
  horizontal_retrieve: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "none",
    costs: "Precision. It covers water well and fishes any one piece of it shallowly.",
    tell: "Consistent depth across the whole retrieve, which usually means counting the sink before you start.",
  },
  stop_and_go: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "moderate",
    pause: "brief",
    contact: "none",
    strikeWindow: "medium",
    current: "none",
    costs: "Consistency. The stop is the point, and it makes depth harder to hold.",
    tell: "Most eats land on the stop. If every one comes on the move, the pause is not doing anything and you can drop it.",
  },
  suspend_pause: {
    depth: ["mid"],
    shape: "retrieve",
    speed: "slow",
    pause: "long",
    contact: "none",
    strikeWindow: "long",
    current: "none",
    costs: "Water covered per hour. This is slow enough to feel unproductive while it is working.",
    tell: "Count the pause out loud. Anglers who guess it are almost always short, and short pauses are why the family gets abandoned.",
  },
  vertical_jig: {
    depth: ["near-bottom", "bottom"],
    shape: "jig",
    speed: "moderate",
    pause: "brief",
    contact: "occasional",
    strikeWindow: "short",
    current: "none",
    costs: "Area. You are fishing a column, not a shoreline.",
    tell: "The line goes slack a beat early — that is the fall stopping, and something stopped it.",
  },
  bottom_contact: {
    depth: ["bottom"],
    shape: "crawl",
    speed: "slow",
    pause: "brief",
    contact: "constant",
    strikeWindow: "medium",
    current: "none",
    costs: "Speed, and terminal tackle. Losing contact is losing the presentation entirely.",
    tell: "You can name the bottom you are crossing — gravel, sand, weed. If you cannot, you are not in contact.",
  },
  slow_drag: {
    depth: ["bottom"],
    shape: "crawl",
    speed: "slow",
    pause: "none",
    contact: "constant",
    strikeWindow: "long",
    current: "none",
    costs: "Almost all your coverage. A drag is nearly as slow as a stationary bait with more chances to snag.",
    tell: "Weight that builds gradually rather than a tick. A drag loads; it does not knock.",
  },
  drop_presentation: {
    depth: "varies",
    shape: "drop",
    speed: "slow",
    pause: "brief",
    contact: "none",
    strikeWindow: "medium",
    current: "none",
    costs: "Horizontal coverage. A drop fishes one column very well and nothing either side of it.",
    tell: "Watch the line, not the rod. A drop that stops early is the most common eat in the family and the easiest to miss.",
  },
  surface_retrieve: {
    depth: "film",
    shape: "surface",
    speed: "moderate",
    pause: "brief",
    contact: "none",
    strikeWindow: "short",
    current: "none",
    costs: "Hookup rate, and the whole column underneath.",
    tell: "You will see the refusals. That is the compensation for the hookups you lose, and it is worth more than it sounds.",
  },
  subsurface_slow_roll: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "slow",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "none",
    costs: "Depth control at range. The further out it lands, the deeper the front of the retrieve runs.",
    tell: "A steady low thrum you can feel through the blank. Lose it and the lure has stopped working.",
  },
  suspended_stationary: {
    depth: ["mid"],
    shape: "hold",
    speed: "dead",
    pause: "long",
    contact: "none",
    strikeWindow: "long",
    current: "none",
    costs: "Search, and the bottom. This is a commitment to one depth as well as one spot.",
    tell: "The depth stays where you set it. If it creeps down over an hour, the rig is not neutral and the presentation has changed without you.",
  },
  trolling: {
    depth: ["upper", "mid"],
    shape: "troll",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "none",
    costs: "Detail. Trolling finds water; it does not read it.",
    tell: "Depth you can repeat. A troll you cannot reproduce taught you nothing when it worked.",
  },
  live_natural_bait_suspension: {
    depth: ["mid", "near-bottom"],
    shape: "hold",
    speed: "dead",
    pause: "long",
    contact: "none",
    strikeWindow: "long",
    current: "none",
    costs: "Control. The bait decides a great deal about the presentation, and it does not consult you.",
    tell: "The bait is still swimming. A tired bait is a different presentation than the one you set up.",
  },

  /* ---------------------------------------------------------------- */
  /* Saltwater                                                         */
  /* ---------------------------------------------------------------- */

  surf_bait_soak: {
    depth: ["bottom"],
    shape: "hold",
    speed: "dead",
    pause: "long",
    contact: "constant",
    strikeWindow: "long",
    current: "none",
    costs: "Everything mobile. You are betting on the trough you chose, for as long as you stay in it.",
    tell: "The lead holds. If it walks down the beach, the surf is fishing your rig and you are watching.",
  },
  surf_metal_cast: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "brisk",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "across",
    costs: "Slow presentations entirely, and a lot of your arm.",
    tell: "It stays down through the wave face instead of skipping out the back of it.",
  },
  surf_swim_retrieve: {
    depth: ["upper", "mid"],
    shape: "retrieve",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "across",
    costs: "Depth in a running sweep, which is most of the days worth fishing.",
    tell: "The lure holds its line across the sweep rather than swinging straight back to the beach.",
  },
  flats_sight_cast: {
    depth: ["film", "upper"],
    shape: "retrieve",
    speed: "moderate",
    pause: "brief",
    contact: "none",
    strikeWindow: "short",
    current: "none",
    costs: "Blind coverage. If you cannot see the fish, this family has almost nothing to offer.",
    tell: "The fish changes what it was doing. Anything else is a cast you get to make again.",
  },
  tidal_drift_bait: {
    depth: ["mid", "near-bottom"],
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "occasional",
    strikeWindow: "medium",
    current: "with",
    costs: "Position. The tide decides where the drift goes and it stops being your decision quickly.",
    tell: "Line angle that stays put. When it starts swinging back under the boat, the drift has ended.",
  },
  structure_pitch: {
    depth: ["mid", "near-bottom"],
    shape: "drop",
    speed: "slow",
    pause: "brief",
    contact: "occasional",
    strikeWindow: "short",
    current: "none",
    costs: "Distance, and terminal tackle. Fishing tight to structure means losing things to it.",
    tell: "The fall stops short of where you expected the bottom.",
  },
  dock_light_ambush: {
    depth: ["film", "upper"],
    shape: "drift",
    speed: "slow",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "with",
    costs: "Daylight. This is a narrow window and most of the day is outside it.",
    tell: "The bait behaves differently at the light edge than in the middle of it. Fish the edge.",
  },
  structure_vertical: {
    depth: ["near-bottom", "bottom"],
    shape: "jig",
    speed: "moderate",
    pause: "brief",
    contact: "occasional",
    strikeWindow: "short",
    current: "none",
    costs: "Coverage, and gear. Vertical over structure is where tackle goes to be tested.",
    tell: "You are staying on the mark. Drift off it and you are jigging open bottom.",
  },
  chum_established_drift: {
    depth: ["upper", "mid"],
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "none",
    strikeWindow: "long",
    current: "with",
    costs: "Time before it works, and it stops working the moment the slick breaks.",
    tell: "Your bait is drifting at the same rate as the slick. Anything else and it is outside the thing you built.",
  },
  tide_line_drift: {
    depth: ["upper", "mid"],
    shape: "drift",
    speed: "dead",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "with",
    costs: "Bottom structure entirely. This family is about an edge in open water.",
    tell: "The line is visible — weed, colour change, debris. If you cannot see the edge, you are guessing at it.",
  },
  trolling_spread: {
    depth: ["upper", "mid"],
    shape: "troll",
    speed: "moderate",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "none",
    costs: "Precision, and a lot of setup for each change you make.",
    tell: "Every bait in the spread is running clean. One tangled rod is a spread you are not actually fishing.",
  },
  deep_drop: {
    depth: ["bottom"],
    shape: "drop",
    speed: "slow",
    pause: "long",
    contact: "occasional",
    strikeWindow: "long",
    current: "none",
    costs: "Everything above the bottom, and a long wait between decisions.",
    tell: "You know when you are down. If you are guessing at the bottom at this depth, nothing else you do matters.",
  },
  run_and_gun_cast: {
    depth: ["film", "upper"],
    shape: "retrieve",
    speed: "brisk",
    pause: "none",
    contact: "none",
    strikeWindow: "short",
    current: "none",
    costs: "Everything patient. The window is short and it closes while you are re-rigging.",
    tell: "The fish are still up when you get there. Arriving late to the spot is most of what goes wrong.",
  },
  live_bait_slow_troll: {
    depth: ["mid"],
    shape: "troll",
    speed: "slow",
    pause: "none",
    contact: "none",
    strikeWindow: "medium",
    current: "none",
    costs: "Coverage. It is slow enough that the water you cross is a small fraction of what a spread would.",
    tell: "The bait swims rather than planes. If it is skipping, the speed has got away from you.",
  },
};

/** Motion for a family, or null where the catalogue has not described one. */
export function motionFor(id: PresentationId): PresentationMotion | null {
  return PRESENTATION_MOTION[id] ?? null;
}
