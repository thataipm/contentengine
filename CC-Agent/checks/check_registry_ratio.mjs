#!/usr/bin/env node
// Mechanical gate for the "registry-ratio-95" rule in rules/rules.json.
//
// Direct instruction, 2026-08-15: "Enforce 95% hyperframes components, leverage all
// library for entire video, and for rest 5% use screenshots etc, a genuine item, use
// brand logos wherever possible." registry-build-always (check_registry_usage.mjs)
// already enforces that every frame is INDIVIDUALLY ACCOUNTED FOR as registry(...) or
// hand-built(...) -- it does not enforce a ratio. This script adds the numeric budget on
// top of that same accounting, reusing the identical Log-section parsing so authors don't
// need a second logging format.
//
// Counts at COMPONENT-tag granularity, not frame granularity: each backtick-quoted item
// inside a registry(...) tag counts as one registry slot, each hand-built(...) tag counts
// as one hand-built slot. This matches the rule's own framing ("leverage all library...
// rest 5%") -- a frame that stacks several registry blocks (a device + a camera-move +
// a caption effect) should not have one hand-built device in a DIFFERENT frame drag the
// whole episode below budget the way frame-level counting would on a short (~5 frame)
// episode, where even one hand-built frame is already 20%.
//
// Usage:
//   node check_registry_ratio.mjs --project-dir hyperframes-<episode> --docs-root <repo-root> [--min-ratio 0.95]

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { minRatio: 0.95 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--docs-root") out.docsRoot = argv[++i];
    else if (a === "--min-ratio") out.minRatio = Number(argv[++i]);
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  out.docsRoot = out.docsRoot ? path.resolve(out.docsRoot) : path.resolve(out.projectDir, "..");
  if (!Number.isFinite(out.minRatio) || out.minRatio <= 0 || out.minRatio > 1) {
    throw new Error(`--min-ratio must be a number in (0, 1], got ${out.minRatio}`);
  }
  return out;
}

// Mirrors check_registry_usage.mjs / check_device_variety.mjs's own Log-section parsing
// exactly, so all three scripts stay in sync against the same source of truth.
function getSlugLogEntry(docsRoot, slug) {
  const notesPath = path.join(docsRoot, "docs", "hyperframes_production_notes.md");
  if (!existsSync(notesPath)) return "";
  const notes = readFileSync(notesPath, "utf-8");
  const logSection = notes.split(/^### Log$/m)[1]?.split(/^##\s/m)[0] ?? "";
  const bulletBlocks = logSection.split(/^(?=- )/m);
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const slugPattern = new RegExp(`^-\\s*\\[\\d{4}-\\d{2}-\\d{2}\\]\\s*${escapedSlug}:`);
  return bulletBlocks.filter((b) => slugPattern.test(b)).join("\n");
}

function countSlots(entryText) {
  const registryTags = [...entryText.matchAll(/registry\(([^)]*)\)/gi)];
  const handBuiltTags = [...entryText.matchAll(/hand-built\(([^)]*)\)/gi)];
  let registrySlots = 0;
  const registryItems = [];
  for (const m of registryTags) {
    const items = [...m[1].matchAll(/`([^`]+)`/g)].map((mm) => mm[1]);
    if (items.length === 0) continue; // malformed tag, no named item -- doesn't count either way
    registrySlots += items.length;
    registryItems.push(...items);
  }
  const handBuiltSlots = handBuiltTags.length; // one slot per hand-built(...) tag, not per word inside it
  const handBuiltItems = handBuiltTags.map((m) => m[1].trim()).filter(Boolean);
  return { registrySlots, handBuiltSlots, registryItems, handBuiltItems };
}

function main() {
  const { projectDir, docsRoot, minRatio } = parseArgs(process.argv.slice(2));
  const slug = path.basename(projectDir);

  const entryText = getSlugLogEntry(docsRoot, slug);
  console.log(`\nRegistry ratio check for "${slug}" (target >= ${(minRatio * 100).toFixed(0)}%)`);

  if (!entryText) {
    console.log(`  no Log entry found for "${slug}" -- nothing to check yet.`);
    console.log(`  (this check depends on the registry-usage log already being filled in; run that check first)`);
    process.exit(0);
  }

  const { registrySlots, handBuiltSlots, registryItems, handBuiltItems } = countSlots(entryText);
  const total = registrySlots + handBuiltSlots;

  if (total === 0) {
    console.log(`  no registry(...) or hand-built(...) tags found in the Log entry -- nothing to check yet.`);
    process.exit(0);
  }

  const ratio = registrySlots / total;
  console.log(`  registry slots (${registrySlots}): ${registryItems.map((i) => `\`${i}\``).join(", ") || "(none)"}`);
  console.log(`  hand-built slots (${handBuiltSlots}): ${handBuiltItems.map((i) => `\`${i}\``).join(", ") || "(none)"}`);
  console.log(`  ratio: ${registrySlots}/${total} = ${(ratio * 100).toFixed(1)}%`);

  if (ratio >= minRatio) {
    console.log(`\n✓ PASS -- ${(ratio * 100).toFixed(1)}% registry, meets the ${(minRatio * 100).toFixed(0)}% target.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- ${(ratio * 100).toFixed(1)}% registry, below the ${(minRatio * 100).toFixed(0)}% target.`);
  console.error(`  Rule (2026-08-15, direct instruction): 95% of the episode's visual devices must come from`);
  console.error(`  \`npx hyperframes catalog\`, 5% ceiling for hand-built -- and that 5% must be a genuine real`);
  console.error(`  item (a real screenshot, a real brand/product logo), not an invented graphic.`);
  console.error(`\n  Before accepting a hand-built device: try a SECOND, differently-worded catalog search for`);
  console.error(`  a different registry block -- a single failed lookup (e.g. \`mk-progress-stat\` rendering`);
  console.error(`  blank) is not itself grounds to fall back, only a real, logged search with no match is.`);
  console.error(`  If the hand-built device(s) are genuinely justified, re-run with`);
  console.error(`  \`--check-args "--min-ratio <lower-value>"\` -- the override is recorded in the manifest for audit.`);
  process.exit(1);
}

main();
