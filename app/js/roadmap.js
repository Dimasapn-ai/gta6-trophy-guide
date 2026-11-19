// The roadmap view: the missable watch-list first, then the eight stages
// in playing order, each with the trophies it holds. Both are built from
// the official descriptions — the stage order follows the chapters,
// strands, counts and one-chance wording the list itself states.

import { ROADMAP_STAGES } from "./data.js";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderMissablePanel(panel, trophies, handlers) {
  panel.textContent = "";
  panel.appendChild(el("h2", null, "Missable watch-list — read before you play"));
  panel.appendChild(el("p", null,
    "Every other trophy on the list is a completion check, a cumulative count or a map sweep: nothing in its official wording gives it a single chance. These are the exceptions the wording itself raises — one hard flag, two watches. Each flag quotes the words it is built from."));
  const flagged = trophies.filter((t) => t.missable);
  for (const trophy of flagged) {
    const line = el("p");
    line.appendChild(el("strong", null,
      `${trophy.name} (${trophy.missable.level === "flag" ? "MISSABLE" : "watch"}): `));
    line.appendChild(document.createTextNode(trophy.missable.note));
    panel.appendChild(line);
    panel.appendChild(el("p", "basis", `Official wording: “${trophy.description}” — ${trophy.missable.basis}`));
  }
  panel.appendChild(el("p", null,
    "House rule that follows from the flag: keep a manual save before major story decisions, and clear this list before starting the final mission."));
}

export function renderRoadmap(stagesEl, trophies, earned, handlers) {
  stagesEl.textContent = "";
  for (const stage of ROADMAP_STAGES) {
    const card = el("section", "stage-card");
    card.appendChild(el("span", "stage-kicker", `Stage ${stage.n} of ${ROADMAP_STAGES.length}`));
    card.appendChild(el("h2", null, stage.title));
    card.appendChild(el("p", null, stage.why));
    const chips = el("div", "stage-trophies");
    for (const trophy of trophies.filter((t) => t.stage === stage.n)) {
      const chip = el("button", "stage-chip" + (earned.has(trophy.id) ? " earned" : ""), "");
      chip.type = "button";
      const mini = el("span", "mini-grade", trophy.grade[0].toUpperCase());
      chip.appendChild(mini);
      chip.appendChild(document.createTextNode(trophy.name));
      chip.addEventListener("click", () => handlers.onJumpToTrophy(trophy.id));
      chips.appendChild(chip);
    }
    card.appendChild(chips);
    stagesEl.appendChild(card);
  }
}
