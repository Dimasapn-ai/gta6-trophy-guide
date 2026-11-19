// Leonida Platinum Path — the hand-in program for gta6-trophy-guide-01.
//
// The guide itself is the static web app in app/ (open app/index.html in a
// browser; it works fully offline). This program delivers it: it copies
// app/ and screenshots/ into the output directory and writes dossier.json
// there with buildDossier from the vendored make.fun library, which must
// stay byte-identical to the kit's copy because the scorer rebuilds the
// dossier with its own and compares the two.
//
// Run locally:  mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// In the grader, MAKEFUN_OUTPUT_DIR is unset and /output is used.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The scorer's published caps for this bounty: the dossier text is capped
// at 160 KiB, at most 4 screenshots of at most 256 KiB each, and app/ is
// at most 993 files and 48 MiB. Passing them to buildDossier makes an
// over-limit entry fail here, at hand-in, rather than at the gate.
const DOSSIER_CAPS = {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  app_max_files: 993,
  app_max_bytes: 50_331_648,
};

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoDir, "app"), join(outputDir, "app"), { recursive: true });
if (existsSync(join(repoDir, "screenshots"))) {
  cpSync(join(repoDir, "screenshots"), join(outputDir, "screenshots"), { recursive: true });
}

const dossier = buildDossier(outputDir, DOSSIER_CAPS);
writeFileSync(join(outputDir, "dossier.json"), dossier);
console.log(`Leonida Platinum Path handed in: app/ and screenshots/ copied to ${outputDir}, dossier.json written (${dossier.length} bytes).`);
