#!/usr/bin/env node
// check_dynamic_svg_mount_risk.mjs
//
// WARN-only heuristic (not a hard gate -- this is a suspected pattern, not a proven bug for
// every match). Real, confirmed incident (hyperframes-your-agent-cant-do-anything, 2026-08-25):
// constellation-hub, mounted as a data-composition-src sub-composition, only ever painted its
// first dynamically-created node in the real render -- hub badge and the other 3 nodes never
// appeared, static across the whole mount window. An isolated same-size harness proved the
// component's OWN code is correct; the failure is specific to the real nested-mount render
// pipeline. Root cause inside the render engine is unknown, but the one structural trait that
// distinguishes constellation-hub from this project's several OTHER working sub-mounts
// (trust-strip, count-up, native-notification-pop -- all of which also do dynamic DOM
// creation via plain createElement) is: constellation-hub ALSO creates SVG elements via
// createElementNS and calls the layout-dependent getTotalLength() on them synchronously,
// inside the same script that then schedules every other reveal (including the hub itself)
// AFTER that call. See docs/hyperframes_production_notes.md's durable-pitfall entry for the
// full incident.
//
// This does not prove every component matching this pattern is broken -- it flags a
// structural similarity worth a real pre-render verification before trusting it in a render,
// the same tier as registry_blocklist.json's "elevated_risk" list (snapshot/verify before
// trusting, not an automatic pass).
//
// Method: for each data-composition-src mount in this episode's frames, read the referenced
// component file and check whether it contains BOTH createElementNS( and .getTotalLength(.
// If it does and it isn't already in registry_blocklist.json's blocked list (already a hard
// gate elsewhere), print a warning with the isolated-harness verification recipe.
//
// Usage:
//   node check_dynamic_svg_mount_risk.mjs --project-dir hyperframes-<episode> --docs-root <repo-root>

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--docs-root") out.docsRoot = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  out.docsRoot = out.docsRoot ? path.resolve(out.docsRoot) : path.resolve(out.projectDir, "..");
  return out;
}

function findMountedComponents(framesDir) {
  const seen = new Map(); // src -> [frame files]
  if (!existsSync(framesDir)) return seen;
  for (const file of readdirSync(framesDir).filter((f) => f.endsWith(".html"))) {
    const html = readFileSync(path.join(framesDir, file), "utf-8");
    const re = /data-composition-src="([^"]+)"/g;
    let m;
    while ((m = re.exec(html))) {
      if (!seen.has(m[1])) seen.set(m[1], []);
      seen.get(m[1]).push(file);
    }
  }
  return seen;
}

function loadBlockedComponentNames(docsRoot) {
  const blocklistPath = path.join(
    docsRoot,
    ".claude",
    "skills",
    "thataipm-registry-check",
    "scripts",
    "registry_blocklist.json"
  );
  if (!existsSync(blocklistPath)) return new Set();
  try {
    const data = JSON.parse(readFileSync(blocklistPath, "utf-8"));
    return new Set((data.blocked || []).map((b) => b.component));
  } catch {
    return new Set();
  }
}

function main() {
  const { projectDir, docsRoot } = parseArgs(process.argv.slice(2));
  const framesDir = path.join(projectDir, "compositions", "frames");

  console.log(`\nDynamic-SVG nested-mount risk scan (warn-only)`);

  const mounted = findMountedComponents(framesDir);
  if (mounted.size === 0) {
    console.log(`  no data-composition-src mounts found -- nothing to scan.`);
    return;
  }

  const blockedNames = loadBlockedComponentNames(docsRoot);
  let anyFlag = false;

  for (const [src, frames] of mounted.entries()) {
    const componentPath = path.join(projectDir, src);
    if (!existsSync(componentPath)) continue;
    const html = readFileSync(componentPath, "utf-8");
    const hasCreateNS = /createElementNS\s*\(/.test(html);
    const hasGetTotalLength = /\.getTotalLength\s*\(/.test(html);
    if (!hasCreateNS || !hasGetTotalLength) continue;

    const componentName = path.basename(src, ".html");
    if (blockedNames.has(componentName)) {
      console.log(`  (skip) ${src}: already a hard block in registry_blocklist.json`);
      continue;
    }

    anyFlag = true;
    console.log(
      `  ~ ${src} (mounted in ${frames.join(", ")}): creates SVG elements dynamically AND calls getTotalLength() synchronously -- same structural pattern as the confirmed constellation-hub failure.`
    );
  }

  if (anyFlag) {
    console.log(`\n  Before trusting a flagged component in a real render, verify with an isolated harness:`);
    console.log(`    1. Extract the component's <template> inner HTML into a standalone page.`);
    console.log(`    2. Wrap it in a host div sized to the EXACT same box as the real mount.`);
    console.log(`    3. Stub window.__hyperframes.getVariables() with the exact real variable values.`);
    console.log(`    4. Set the #root's data-duration attribute to the exact real mount duration.`);
    console.log(`    5. Load it, run window.__timelines['<id>'].progress(0.6), and read`);
    console.log(`       getBoundingClientRect() on every element that should be visible.`);
    console.log(`    If the harness renders everything correctly but the real render doesn't,`);
    console.log(`    that confirms the same nested-mount engine failure -- hand-build instead,`);
    console.log(`    log it as hand-built-bug-workaround, and add the component to`);
    console.log(`    registry_blocklist.json's blocked list.`);
  } else {
    console.log(`  no mounted component matches the risky pattern.`);
  }
}

main();
