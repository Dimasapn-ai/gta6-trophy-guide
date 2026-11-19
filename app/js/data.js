// Loads the trophy data file and holds the guide's shared vocabulary:
// grade point values, kind labels and the roadmap stage definitions.

export const GRADE_POINTS = { bronze: 15, silver: 30, gold: 90, platinum: 300 };

export const KIND_LABELS = {
  story: "Story",
  strangers: "Strangers",
  collectibles: "Collectibles",
  activities: "Activities",
  crime: "Crime & Heists",
  money: "Money & Property",
  exploration: "Exploration",
  moments: "One-off Moments",
  completion: "Completion",
  platinum: "Platinum",
  online: "Online",
};

// The roadmap's stages, in the order the guide recommends playing them.
// Each stage's reasoning is drawn from the official descriptions alone:
// chapters chain in order, strands can be swept between chapters, the
// collectible and activity totals are map-wide grinds, and the final
// mission plus the 100% counter close the list.
export const ROADMAP_STAGES = [
  {
    n: 1,
    title: "Opening — Gone Fishing and Chapter 1",
    why: "The story opens the list. Gone Fishing stands at the head of the mission trophies and Chapter 1 follows it; nothing else on the list can be reached before the game lets you play, so the platinum path starts here.",
  },
  {
    n: 2,
    title: "Chapters 2–4 and the named story missions",
    why: "Chapters 2, 3 and 4, with the named missions the list ties to the story — Breakfast Run, The Cartel Heist, Child's Play, Headliners, VCIA Takedown and Operation Savage Glory. Play them as they appear; each is a completion check only.",
  },
  {
    n: 3,
    title: "Strangers across Leonida",
    why: "The stranger strands — Andy, Kenton, Billy, Randy, Tyrone and Bret's hunt — plus the 8-strand total of Strangers & Freaks. Sweep them between chapters while the story is still running, and mind the watch-list: Bret's animal is described as unique.",
  },
  {
    n: 4,
    title: "Collectibles and the whole map",
    why: "The map-wide sweeps: every meditation spot, 3 complete card sets, WAiNK at 100 locations, 100 vehicles discovered, 10 vehicles registered, and all of Leonida explored. Work region by region so one trip serves several trophies.",
  },
  {
    n: 5,
    title: "Activities and the long grinds",
    why: "The scored work: 250 stunts, gold in all 42 Shooting Range challenges, 20 different race wins, a drone-race win at every location, Cal's fishing challenge, one arcade completion, 50 challenges, and 5 takedowns in a single Combat Focus. Sample each activity once early (Master of None), then grind steadily.",
  },
  {
    n: 6,
    title: "Crime, cash and property",
    why: "The money stage: shop, jewelry, vault and truck robberies, one Illegal Operation per gang, the two partner wanted-level trophies, $250,000 laundered and $100,000 spent, and every garage bought. The crime feeds the cash; the cash buys the garages.",
  },
  {
    n: 7,
    title: "One-off moments and feats",
    why: "The cryptic ten — an unscheduled departure at VCIA, a tank, a cocktail on Ocean Beach, a showroom escape, a bowling follow-through, a melee drive-by and the three riddles. Attempt them whenever you are nearby; the choice-based one, Actions Speak Louder, is the missable flag to respect.",
  },
  {
    n: 8,
    title: "Finale — final mission, 100%, platinum",
    why: "Close the list in its own order: the final mission (gold), then Attain 100% Completion (gold) once every counter the other trophies name is full, and the platinum — Vice Got a Price! — unlocks on its own the moment the other 54 are earned.",
  },
];

export async function loadTrophyData() {
  const response = await fetch("data/trophies.json");
  if (!response.ok) throw new Error(`trophies.json: HTTP ${response.status}`);
  const data = await response.json();
  const trophies = Array.isArray(data) ? data : data.trophies;
  return { meta: Array.isArray(data) ? {} : data, trophies };
}

export function totalPoints(trophies) {
  return trophies.reduce((sum, t) => sum + (GRADE_POINTS[t.grade] ?? 0), 0);
}

export function stageOf(trophy) {
  return ROADMAP_STAGES.find((s) => s.n === trophy.stage) ?? null;
}
