# Leonida Platinum Path — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Dimasapn-ai/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Dimasapn-ai/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI. Open the guide, work the roadmap, tick trophies off as they pop — everything runs from the files in `app/`, with no network needed and nothing installed.

## What it does

- **All 55 trophies, exactly as published.** Every trophy shows its official PlayStation name, description and grade (1 platinum, 2 gold, 6 silver, 46 bronze). Beside each one sits a practical guide written for this app — what to do, when to do it, and how to do it efficiently.
- **Sources beside every guide.** Each guide names where its facts come from: the official trophy list as listed by Exophase and PSNProfiles, a clearly labelled series precedent from GTA V where one is used, or the guide author's own inference from the official wording, marked as inference. A claim with no source earns nothing here, so there are none.
- **A roadmap to the platinum.** Eight stages in playing order — story chapters, stranger strands, collectible sweeps, activity grinds, the crime-and-cash stage, the cryptic one-off moments, and the finale of final mission, 100% completion and the platinum itself. Every stage's order is argued from the official descriptions: chapter chains, strand structure, tracked counts.
- **Missable flags built from the wording.** One hard flag (the choice-based *Actions Speak Louder*) and two watches (*Fair Game*'s unique animal, *Bad Luck, I Guess*'s promised second time), each quoting the official words it is built from, gathered in a watch-list at the top of the roadmap.
- **A tracker that remembers.** Tick trophies off and progress is saved in the browser (localStorage), with an earned count and a grade-weighted points total (bronze 15, silver 30, gold 90, platinum 300 — a 1,350-point list). Export the checklist to a JSON file and import it back on another browser or as a backup.
- **Filters and a spoiler shield.** Filter by kind — story, missable, collectibles, activities, strangers, crime, money, exploration, moments — by grade, by earned status, or by search. (The official list contains no online trophies; the Online filter says so rather than pretending.) The spoiler shield hides the names, descriptions and guides of story trophies until you have earned them.

## Running it

Serve the `app/` folder with any static file server and open `index.html` in a desktop browser — for example, from the repository root:

```
python3 -m http.server 8080 --directory app
# then open http://localhost:8080 in the browser
```

or simply run the hand-in program, which copies `app/` and `screenshots/` to an output directory and writes the entry's `dossier.json`:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The app itself makes no network requests: the trophy data loads from `app/data/trophies.json` beside the page, and every script and stylesheet is a file in `app/`.

## Layout

- `app/index.html` — the page: header with progress, toolbar, checklist, detail panel, roadmap.
- `app/style.css` — the app's own dusk-violet and sunset styling; no game artwork or logos anywhere.
- `app/data/trophies.json` — the 55 trophies: official name, description and grade, plus kind, roadmap stage, tracked count, missable analysis, guide and sources for each.
- `app/js/` — `data.js` (loading, grade points, kind labels, roadmap stages), `tracker.js` (localStorage state, export/import), `guide.js` (checklist, filters, spoiler shield, detail panel), `roadmap.js` (watch-list and stages), `app.js` (boot and wiring).
- `main.ts` — the hand-in program; `vendor/makefun-frontend.ts` is the competition kit's dossier library, kept byte-identical as the rules require.
- `screenshots/` — four screenshots of the running app: a cited guide open in the checklist, the missable flag, the roadmap, and the spoiler shield at work.

Trophy names, descriptions and grades are the official PlayStation list for Grand Theft Auto VI on PS5, shown as published. This project is not affiliated with Rockstar Games or PlayStation.

<sub>Entered on [make.fun](https://make.fun/?ref=tdk3vr62&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
