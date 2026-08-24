#!/usr/bin/env node
// Real, working mechanical gate for the "device-variety" rule in rules/rules.json.
//
// This is the rule that DIDN'T EXIST anywhere in the project before CC-Agent. On
// hyperframes-the-caveman-skill, every frame reused browser-device-stage (a screenshot
// stager) with only camera moves and content differing -- check_static_gaps.mjs passed
// (real tweens were running), check_registry_usage.mjs passed (every frame used a real
// registry item), hyperframes check passed (no lint/runtime/layout/motion/contrast
// errors). Nothing checked that the frames were actually DIFFERENT DEVICES, and the
// gap only surfaced because the user watched the render and got angry. This script
// closes that gap mechanically, using the exact same Log-section entries the registry
// check already parses -- no new authoring burden, the data already exists.
//
// Reuses docs/hyperframes_production_notes.md's "### Log" section format from
// check_registry_usage.mjs: "- [date] slug: Frame 1 registry(`item-a`, `item-b`); Frame 2 ..."
//
// A device counts as a violation only if it's a "content device" -- not in the
// configured utility allowlist (camera-move helpers, caption overlays, transitions,
// which are legitimately reused every frame by design) -- and appears in 2+ frames.
//
// Usage:
//   node check_device_variety.mjs --project-dir hyperframes-<episode> --docs-root <repo-root> [--allowlist <path>]

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--docs-root") out.docsRoot = argv[++i];
    else if (a === "--allowlist") out.allowlistPath = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  out.docsRoot = out.docsRoot ? path.resolve(out.docsRoot) : path.resolve(out.projectDir, "..");
  out.allowlistPath = out.allowlistPath
    ? path.resolve(out.allowlistPath)
    : path.resolve(__dirname, "..", "rules", "device-variety-allowlist.json");
  return out;
}

function loadAllowlist(allowlistPath) {
  if (!existsSync(allowlistPath)) {
    throw new Error(`allowlist not found at ${allowlistPath}`);
  }
  const parsed = JSON.parse(readFileSync(allowlistPath, "utf-8"));
  return new Set(parsed.utility_devices || []);
}

// Mirrors check_registry_usage.mjs's Log-section parsing exactly, so both scripts stay
// in sync against the same source of truth without duplicating the parsing logic's own
// bug surface (the wrapped-continuation-line fix that script already made applies here too).
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

// Extracts { frameNumber: [deviceName, ...] } from entry text like:
// "Frame 1 registry(`browser-device-stage`, `caption-kinetic-slam`); Frame 2 hand-built(chart) — why; Frame 3 registry(`terminal-simulator`)"
function parseFrameDevices(entryText) {
  const frameDevices = {};
  // Split on "Frame N" boundaries, keep the frame number and the text up to the next "Frame N" or end.
  const frameChunks = [...entryText.matchAll(/Frame\s+(\d+)\s+((?:registry|hand-built)\([^)]*\)[^;]*)/gi)];
  for (const m of frameChunks) {
    const frameNum = Number(m[1]);
    const chunk = m[2];
    const registryMatch = chunk.match(/^registry\(([^)]*)\)/);
    if (!registryMatch) continue; // hand-built entries have no registry device name to compare
    const items = [...registryMatch[1].matchAll(/`([^`]+)`/g)].map((mm) => mm[1]);
    frameDevices[frameNum] = (frameDevices[frameNum] || []).concat(items);
  }
  return frameDevices;
}

function main() {
  const { projectDir, docsRoot, allowlistPath } = parseArgs(process.argv.slice(2));
  const slug = path.basename(projectDir);
  const utilityDevices = loadAllowlist(allowlistPath);

  const entryText = getSlugLogEntry(docsRoot, slug);
  const frameDevices = parseFrameDevices(entryText);
  const frameNumbers = Object.keys(frameDevices).map(Number).sort((a, b) => a - b);

  console.log(`\nDevice-variety check for "${slug}"`);
  if (frameNumbers.length === 0) {
    console.log(`  no registry(...) entries found in the Log section -- nothing to check yet.`);
    console.log(`  (this check depends on the registry-usage log already being filled in; run that check first)`);
    process.exit(0);
  }

  // deviceName -> [frameNumber, ...], content devices only (utility allowlist excluded)
  const deviceFrames = {};
  for (const frameNum of frameNumbers) {
    for (const device of frameDevices[frameNum]) {
      if (utilityDevices.has(device)) continue;
      (deviceFrames[device] = deviceFrames[device] || []).push(frameNum);
    }
  }

  for (const frameNum of frameNumbers) {
    const content = frameDevices[frameNum].filter((d) => !utilityDevices.has(d));
    const utility = frameDevices[frameNum].filter((d) => utilityDevices.has(d));
    console.log(`  Frame ${frameNum}: content(${content.join(", ") || "none"}) utility(${utility.join(", ") || "none"})`);
  }

  const violations = Object.entries(deviceFrames).filter(([, frames]) => frames.length > 1);

  if (violations.length === 0) {
    console.log(`\n✓ PASS -- no content-carrying device repeats across frames.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- the same content-carrying device appears in multiple frames:`);
  for (const [device, frames] of violations) {
    console.error(`  \`${device}\` used in Frame ${frames.join(", ")} -- this reads as one repeated scene to a viewer,`);
    console.error(`  even with different camera moves or content. Swap the repeat(s) for a genuinely different`);
    console.error(`  registry device, or add \`${device}\` to rules/device-variety-allowlist.json's utility_devices`);
    console.error(`  ONLY if it's genuinely a cross-cutting overlay/transition, not a content device.`);
  }
  process.exit(1);
}

main();
