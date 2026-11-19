// The guide view: the trophy checklist with its filters on the left and
// the selected trophy's full guide — official description, missable
// warning, own-words guide and cited sources — on the right.

import { GRADE_POINTS, KIND_LABELS, stageOf } from "./data.js";

export const SPECIAL_FILTERS = [
  { key: "all", label: "All 55" },
  { key: "missable", label: "Missable & Watch-list" },
];

export function isSpoilerHidden(trophy, view) {
  return view.spoilerShield && trophy.kind === "story" && !view.earned.has(trophy.id);
}

export function countForFilter(trophies, key) {
  if (key === "all") return trophies.length;
  if (key === "missable") return trophies.filter((t) => t.missable).length;
  return trophies.filter((t) => t.kind === key).length;
}

export function renderKindFilters(container, trophies, activeKind, onPick) {
  container.textContent = "";
  const keys = [...SPECIAL_FILTERS.map((f) => f.key), ...Object.keys(KIND_LABELS)];
  for (const key of keys) {
    const count = countForFilter(trophies, key);
    if (key !== "all" && count === 0 && key !== "online") continue;
    const label = key === "all" || key === "missable"
      ? SPECIAL_FILTERS.find((f) => f.key === key).label
      : KIND_LABELS[key];
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (key === activeKind ? " active" : "");
    chip.innerHTML = `${label} <span class="chip-count">${count}</span>`;
    chip.addEventListener("click", () => onPick(key));
    container.appendChild(chip);
  }
}

export function applyFilters(trophies, view) {
  const query = view.search.trim().toLowerCase();
  return trophies.filter((t) => {
    if (view.kind === "missable" && !t.missable) return false;
    if (view.kind !== "all" && view.kind !== "missable" && t.kind !== view.kind) return false;
    if (view.grade !== "all" && t.grade !== view.grade) return false;
    if (view.status === "earned" && !view.earned.has(t.id)) return false;
    if (view.status === "open" && view.earned.has(t.id)) return false;
    if (query) {
      const haystack = `${t.name} ${t.description} ${t.guide} ${KIND_LABELS[t.kind] ?? ""}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderTrophyList(listEl, trophies, view, handlers) {
  listEl.textContent = "";
  if (trophies.length === 0) {
    listEl.appendChild(el("li", "empty-note",
      view.kind === "online"
        ? "No online trophies exist on the official list — see the note above."
        : "No trophies match these filters."));
    return;
  }
  for (const trophy of trophies) {
    const hidden = isSpoilerHidden(trophy, view);
    const row = el("li", "trophy-row"
      + (view.earned.has(trophy.id) ? " earned" : "")
      + (view.selectedId === trophy.id ? " selected" : "")
      + (hidden ? " spoiler-hidden" : ""));

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = view.earned.has(trophy.id);
    check.setAttribute("aria-label", `Mark ${trophy.name} as earned`);
    check.addEventListener("click", (event) => event.stopPropagation());
    check.addEventListener("change", () => handlers.onToggleEarned(trophy.id));
    row.appendChild(check);

    row.appendChild(el("span", `grade-badge grade-${trophy.grade}`, trophy.grade));

    const names = el("div", "trophy-names");
    names.appendChild(el("div", "trophy-name",
      hidden ? "Hidden story trophy" : trophy.name));
    names.appendChild(el("div", "trophy-desc",
      hidden ? "Name and description hidden by the spoiler shield until earned." : trophy.description));
    row.appendChild(names);

    const tags = el("div", "row-tags");
    tags.appendChild(el("span", "kind-tag", KIND_LABELS[trophy.kind] ?? trophy.kind));
    if (trophy.missable) {
      tags.appendChild(el("span",
        "missable-tag" + (trophy.missable.level === "watch" ? " watch" : ""),
        trophy.missable.level === "flag" ? "Missable" : "Watch"));
    }
    if (trophy.count) tags.appendChild(el("span", "count-tag", `Target: ${trophy.count.toLocaleString("en-US")}`));
    row.appendChild(tags);

    row.addEventListener("click", () => handlers.onSelect(trophy.id));
    listEl.appendChild(row);
  }
}

export function renderTrophyDetail(detailEl, trophy, view, handlers) {
  detailEl.textContent = "";
  if (!trophy) {
    detailEl.appendChild(el("p", "empty-note", "Select a trophy to read its guide."));
    return;
  }
  const hidden = isSpoilerHidden(trophy, view);
  const earned = view.earned.has(trophy.id);

  const meta = el("div", "detail-meta");
  meta.appendChild(el("span", `grade-badge grade-${trophy.grade}`,
    `${trophy.grade} · ${GRADE_POINTS[trophy.grade]} pts`));
  meta.appendChild(el("span", "kind-tag", KIND_LABELS[trophy.kind] ?? trophy.kind));
  const stage = stageOf(trophy);
  if (stage) meta.appendChild(el("span", "kind-tag", `Roadmap stage ${stage.n} — ${stage.title}`));
  detailEl.appendChild(meta);

  detailEl.appendChild(el("h2", null, hidden ? "Hidden story trophy" : trophy.name));

  const quote = el("blockquote", "official-quote");
  quote.appendChild(el("span", "official-label", "Official description — PlayStation"));
  quote.appendChild(document.createTextNode(
    hidden ? "Hidden by your spoiler shield until this trophy is earned." : trophy.description));
  detailEl.appendChild(quote);

  if (hidden) {
    detailEl.appendChild(el("p", null,
      "The spoiler shield is on: this story trophy's name, description and guide stay hidden until you mark it earned. Turn the shield off in the toolbar to read it now."));
  } else {
    if (trophy.missable) {
      const alert = el("div", "missable-alert" + (trophy.missable.level === "watch" ? " watch" : ""));
      alert.appendChild(el("strong", null,
        trophy.missable.level === "flag" ? "Missable — " : "Missable watch — "));
      alert.appendChild(document.createTextNode(trophy.missable.note));
      alert.appendChild(el("p", "basis", `Built from the official wording: ${trophy.missable.basis}`));
      detailEl.appendChild(alert);
    }
    if (trophy.count) {
      detailEl.appendChild(el("p", null,
        `Tracked target: ${trophy.count.toLocaleString("en-US")} — the count in the official description.`));
    }
    detailEl.appendChild(el("h3", null, "Guide"));
    detailEl.appendChild(el("p", null, trophy.guide));
    detailEl.appendChild(el("h3", null, "Sources — where this guide's facts come from"));
    const sources = el("ul", "sources-list");
    for (const source of trophy.sources) sources.appendChild(el("li", null, source));
    detailEl.appendChild(sources);
  }

  const actions = el("div", "detail-actions");
  const label = el("label");
  const check = document.createElement("input");
  check.type = "checkbox";
  check.checked = earned;
  check.addEventListener("change", () => handlers.onToggleEarned(trophy.id));
  label.appendChild(check);
  label.appendChild(document.createTextNode(earned ? "Earned" : "Mark as earned"));
  actions.appendChild(label);
  detailEl.appendChild(actions);
}
