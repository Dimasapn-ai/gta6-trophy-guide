// The checklist's memory: which trophies are earned, and whether the
// spoiler shield is on. Everything lives in localStorage; export writes
// the same state to a JSON file and import reads it back, so a checklist
// can move between browsers or be kept as a backup.

const EARNED_KEY = "leonida-platinum-path.earned.v1";
const SPOILER_KEY = "leonida-platinum-path.spoilerShield.v1";
const EXPORT_APP = "leonida-platinum-path";

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function loadEarnedIds() {
  const ids = readJson(EARNED_KEY, []);
  return new Set(Array.isArray(ids) ? ids.filter((n) => Number.isInteger(n)) : []);
}

export function saveEarnedIds(earned) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSpoilerShield() {
  return readJson(SPOILER_KEY, false) === true;
}

export function saveSpoilerShield(on) {
  localStorage.setItem(SPOILER_KEY, JSON.stringify(on === true));
}

export function exportChecklist(earned, spoilerShield) {
  const payload = {
    app: EXPORT_APP,
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
    spoilerShield: spoilerShield === true,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "leonida-platinum-path-checklist.json";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function importChecklist(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(ids)) throw new Error("That file holds no earned list.");
  return {
    earned: new Set(ids.filter((n) => Number.isInteger(n))),
    spoilerShield: !Array.isArray(parsed) && parsed.spoilerShield === true,
  };
}
