#!/usr/bin/env node
// Mechanical gate for the "registry-ratio" rule in rules/rules.json.
//
// Direct instruction, 2026-08-15: "Enforce 95% hyperframes components, leverage all
// library for entire video, and for rest 5% use screenshots etc, a genuine item, use
// brand logos wherever possible." registry-build-always (check_registry_usage.mjs)
// already enforces that every frame is INDIVIDUALLY ACCOUNTED FOR -- it does not enforce
// a ratio. This script adds the numeric budget on top of that same accounting, reusing
// the identical Log-section parsing so authors don't need a second logging format.
//
// Revised 2026-08-24, real production test (hyperframes-your-agent-cant-do-anything) and
// direct instruction: the original version counted every screenshot(...) as a plain
// hand-built(...) slot, which meant an episode that correctly followed the OTHER standing
// rule (real screenshots at beats where showing the actual product is the literal point,
// per CLAUDE.md's "screenshots and real UI over generic icons/mock UI") got penalized for
// following it. Direct correction: "we should use real screenshots only where its
// logically applicable" -- screenshots are their own category, not a competitor to
// registry devices in this ratio. Three tags are now exempt from the ratio entirely (they
// still count as "frame accounted for" in check_registry_usage.mjs, just not toward this
// specific budget):
//   - screenshot(<real source>) -- a real captured product screenshot at a beat where
//     showing the actual UI is the point (a tool intro, a real workflow step). Not a
//     registry gap, not an avoidable hand-build -- a deliberate, different device choice.
//   - hand-built-bug-workaround(<item>) — <durable-pitfall reference> -- a registry item
//     exists, was installed, and was tried, but a CONFIRMED, LOGGED render-engine bug
//     makes it non-functional (e.g. the nested-paste-in-wrapper-invisible bug this project
//     has hit 3+ times). This is not "did you check the registry" failing -- the registry
//     was checked, it just doesn't work. Forcing this to compete against the 95% target
//     just teaches people to stop logging the real reason.
//   - hand-built-real-asset(<item>) — <why> -- added 2026-08-24 (`hyperframes-your-agent-
//     cant-do-anything`, direct instruction "use actual logo for tools we say out loud"),
//     the same 2026-08-15 instruction this whole rule is built on explicitly says "use
//     brand logos wherever possible" in the same breath as the 95% target -- a real-logo
//     row assembled from captured official brand icons is not a lazy hand-build, it's the
//     SAME category as screenshot() (real, non-fabricated content) for a shape (multiple
//     real logos laid out together) no registry item covers (checked: trust-strip is
//     text-wordmarks only, logo-wall's own file states it's placeholder lettermarks
//     "WITHOUT using real brand assets"). Reserve this tag for devices built FROM real
//     captured brand/product imagery, not a general escape hatch for any hand-build.
// Only registry(...) and plain hand-built(...) -- <why no registry match> still compete
// for the ratio, which is what this rule was actually meant to catch: reaching for a
// hand-built device out of habit instead of searching the catalog.
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
//   node check_registry_ratio.mjs --project-dir hyperframes-<episode> --docs-root <repo-root> [--min-ratio 0.9]

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { minRatio: 0.9 };
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
  // Exempt tags first, so their content doesn't also get swept up by the plain
  // hand-built(...) regex below (hand-built-bug-workaround contains the substring
  // "hand-built" but is a distinct, exempt tag).
  const bugWorkaroundTags = [...entryText.matchAll(/hand-built-bug-workaround\(([^)]*)\)/gi)];
  const realAssetTags = [...entryText.matchAll(/hand-built-real-asset\(([^)]*)\)/gi)];
  const screenshotTags = [...entryText.matchAll(/screenshot\(([^)]*)\)/gi)];
  const exemptCount = bugWorkaroundTags.length + realAssetTags.length + screenshotTags.length;
  const exemptItems = [
    ...bugWorkaroundTags.map((m) => `bug-workaround: ${m[1].trim()}`),
    ...realAssetTags.map((m) => `real-asset: ${m[1].trim()}`),
    ...screenshotTags.map((m) => `screenshot: ${m[1].trim()}`),
  ];

  const textWithoutExempt = entryText
    .replace(/hand-built-bug-workaround\([^)]*\)/gi, "")
    .replace(/hand-built-real-asset\([^)]*\)/gi, "")
    .replace(/screenshot\([^)]*\)/gi, "");

  const registryTags = [...textWithoutExempt.matchAll(/registry\(([^)]*)\)/gi)];
  const handBuiltTags = [...textWithoutExempt.matchAll(/hand-built\(([^)]*)\)/gi)];
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
  return { registrySlots, handBuiltSlots, registryItems, handBuiltItems, exemptCount, exemptItems };
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

  const { registrySlots, handBuiltSlots, registryItems, handBuiltItems, exemptCount, exemptItems } = countSlots(entryText);
  const total = registrySlots + handBuiltSlots;

  if (total === 0 && exemptCount === 0) {
    console.log(`  no registry(...) or hand-built(...) tags found in the Log entry -- nothing to check yet.`);
    process.exit(0);
  }

  console.log(`  registry slots (${registrySlots}): ${registryItems.map((i) => `\`${i}\``).join(", ") || "(none)"}`);
  console.log(`  hand-built slots (${handBuiltSlots}): ${handBuiltItems.map((i) => `\`${i}\``).join(", ") || "(none)"}`);
  if (exemptCount > 0) {
    console.log(`  exempt slots (${exemptCount}, not counted toward the ratio): ${exemptItems.join("; ")}`);
  }

  if (total === 0) {
    console.log(`\n✓ PASS -- every device this episode used is a real screenshot or a confirmed engine-bug`);
    console.log(`  workaround, nothing left to compute a registry/hand-built ratio from.`);
    process.exit(0);
  }

  const ratio = registrySlots / total;
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
