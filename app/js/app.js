// Leonida Platinum Path — boot and wiring. Loads the trophy data, holds
// the view state (filters, selection, earned set, spoiler shield), and
// re-renders the guide, the detail panel, the roadmap and the progress
// header whenever anything changes.

import { loadTrophyData, totalPoints, GRADE_POINTS } from "./data.js";
import {
  loadEarnedIds, saveEarnedIds, loadSpoilerShield, saveSpoilerShield,
  exportChecklist, importChecklist,
} from "./tracker.js";
import { applyFilters, renderKindFilters, renderTrophyList, renderTrophyDetail } from "./guide.js";
import { renderMissablePanel, renderRoadmap } from "./roadmap.js";

const view = {
  trophies: [],
  earned: loadEarnedIds(),
  spoilerShield: loadSpoilerShield(),
  kind: "all",
  grade: "all",
  status: "all",
  search: "",
  selectedId: null,
  tab: "guide",
};

const els = {};
for (const id of [
  "earned-count", "earned-points", "progress-bar", "tab-guide", "tab-roadmap",
  "guide-view", "roadmap-view", "search-box", "grade-filter", "status-filter",
  "spoiler-toggle", "export-button", "import-button", "import-file",
  "kind-filters", "online-note", "trophy-list", "trophy-detail",
  "missable-panel", "roadmap-stages",
]) {
  els[id] = document.getElementById(id);
}

const handlers = {
  onToggleEarned(id) {
    if (view.earned.has(id)) view.earned.delete(id);
    else view.earned.add(id);
    saveEarnedIds(view.earned);
    render();
  },
  onSelect(id) {
    view.selectedId = id;
    render();
  },
  onJumpToTrophy(id) {
    view.selectedId = id;
    view.tab = "guide";
    view.kind = "all";
    view.grade = "all";
    view.status = "all";
    view.search = "";
    els["search-box"].value = "";
    els["grade-filter"].value = "all";
    els["status-filter"].value = "all";
    render();
    els["trophy-detail"].scrollIntoView({ block: "nearest" });
  },
};

function renderProgress() {
  const total = view.trophies.length;
  const earnedCount = view.trophies.filter((t) => view.earned.has(t.id)).length;
  const points = view.trophies
    .filter((t) => view.earned.has(t.id))
    .reduce((sum, t) => sum + (GRADE_POINTS[t.grade] ?? 0), 0);
  const allPoints = totalPoints(view.trophies);
  els["earned-count"].textContent = `${earnedCount} of ${total} trophies`;
  els["earned-points"].textContent = `${points.toLocaleString("en-US")} / ${allPoints.toLocaleString("en-US")} pts`;
  els["progress-bar"].style.width = `${total === 0 ? 0 : (earnedCount / total) * 100}%`;
}

function render() {
  renderProgress();
  els["tab-guide"].classList.toggle("active", view.tab === "guide");
  els["tab-roadmap"].classList.toggle("active", view.tab === "roadmap");
  els["guide-view"].hidden = view.tab !== "guide";
  els["roadmap-view"].hidden = view.tab !== "roadmap";
  els["online-note"].hidden = view.kind !== "online";

  renderKindFilters(els["kind-filters"], view.trophies, view.kind, (kind) => {
    view.kind = kind;
    render();
  });

  const visible = applyFilters(view.trophies, view);
  if (view.selectedId !== null && !view.trophies.some((t) => t.id === view.selectedId)) {
    view.selectedId = null;
  }
  renderTrophyList(els["trophy-list"], visible, view, handlers);
  const selected = view.trophies.find((t) => t.id === view.selectedId) ?? null;
  renderTrophyDetail(els["trophy-detail"], selected, view, handlers);

  renderMissablePanel(els["missable-panel"], view.trophies, handlers);
  renderRoadmap(els["roadmap-stages"], view.trophies, view.earned, handlers);
}

function wireControls() {
  els["tab-guide"].addEventListener("click", () => { view.tab = "guide"; render(); });
  els["tab-roadmap"].addEventListener("click", () => { view.tab = "roadmap"; render(); });
  els["search-box"].addEventListener("input", (event) => { view.search = event.target.value; render(); });
  els["grade-filter"].addEventListener("change", (event) => { view.grade = event.target.value; render(); });
  els["status-filter"].addEventListener("change", (event) => { view.status = event.target.value; render(); });
  els["spoiler-toggle"].checked = view.spoilerShield;
  els["spoiler-toggle"].addEventListener("change", (event) => {
    view.spoilerShield = event.target.checked;
    saveSpoilerShield(view.spoilerShield);
    render();
  });
  els["export-button"].addEventListener("click", () => exportChecklist(view.earned, view.spoilerShield));
  els["import-button"].addEventListener("click", () => els["import-file"].click());
  els["import-file"].addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const imported = await importChecklist(file);
      view.earned = imported.earned;
      view.spoilerShield = imported.spoilerShield;
      saveEarnedIds(view.earned);
      saveSpoilerShield(view.spoilerShield);
      els["spoiler-toggle"].checked = view.spoilerShield;
      render();
    } catch (error) {
      alert(`That checklist file could not be read: ${error.message}`);
    }
    event.target.value = "";
  });
}

async function boot() {
  wireControls();
  try {
    const { trophies } = await loadTrophyData();
    view.trophies = trophies;
    view.selectedId = trophies.find((t) => t.id === 48)?.id ?? trophies[0]?.id ?? null;
    render();
  } catch (error) {
    els["trophy-list"].innerHTML = "";
    const note = document.createElement("li");
    note.className = "empty-note";
    note.textContent = `The trophy data could not be loaded (${error.message}). Serve the app/ folder over HTTP — the data file loads beside this page.`;
    els["trophy-list"].appendChild(note);
  }
}

boot();
