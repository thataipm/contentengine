#!/usr/bin/env node
// check_duration_envelope.mjs
//
// Real, confirmed bug class (hyperframes-your-agent-cant-do-anything, 2026-08-24): a
// data-composition-src sub-mount held LONGER than its own declared native
// data-composition-duration goes silently blank past that envelope for a component whose
// internal timeline is a FIXED-length sequence with nothing scheduled after it ends
// (trust-strip: native 3.5s, mounted 4.3s -- blank for the extra 0.8s). A different
// component mounted the same way but reading its own duration to fill an elastic HOLD span
// (count-up, native-notification-pop) renders correctly even mounted 2x past native. Neither
// hyperframes check, the static-gap check, nor the freeze check catch this -- only a direct
// native-resolution ffmpeg frame pull did, after render. This mechanizes the exact read this
// project's own durable-pitfalls doc tells you to do by hand: "read the component's own
// <script> for root.dataset.duration usage" before trusting a longer-than-native mount.
//
// Method: for each compositions/frames/*.html, find every data-composition-src mount and
// its own data-duration. Resolve the referenced component file, read its own declared
// data-composition-duration (native default) off the outer <html> tag, and check whether
// its <script> reads `root.dataset.duration` or `root.dataset["duration"]` anywhere (the
// signature of an elastic-HOLD component per this project's own component-authoring
// convention). Mount duration > native AND no such read = hard FAIL. Mount duration > native
// AND a read exists = informational pass (still worth a human's eye once, not a gate).
//
// Usage:
//   node check_duration_envelope.mjs --project-dir hyperframes-<episode>

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

function findMounts(frameHtml) {
  // Matches each `<div ... data-composition-src="X" ...>` opening tag as a whole, then
  // pulls src/duration out of it independent of attribute order (a real order-dependent
  // regex bug shipped false-fails earlier this project's history -- see
  // check_paste_in_wiring.mjs's own fix for the same class of mistake).
  const mounts = [];
  const tagRe = /<div\b[^>]*data-composition-src=[^>]*>/g;
  let m;
  while ((m = tagRe.exec(frameHtml))) {
    const tag = m[0];
    const srcMatch = tag.match(/data-composition-src="([^"]+)"/);
    const durMatch = tag.match(/data-duration="([^"]+)"/);
    if (!srcMatch) continue;
    mounts.push({
      src: srcMatch[1],
      mountDuration: durMatch ? Number(durMatch[1]) : null,
    });
  }
  return mounts;
}

function componentInfo(componentPath) {
  if (!existsSync(componentPath)) return null;
  const html = readFileSync(componentPath, "utf-8");
  const nativeMatch = html.match(/<html\b[^>]*data-composition-duration="([^"]+)"/);
  const native = nativeMatch ? Number(nativeMatch[1]) : null;
  const elastic = /root\.dataset\.duration|root\.dataset\[["']duration["']\]/.test(html);
  return { native, elastic };
}

function main() {
  const { projectDir } = parseArgs(process.argv.slice(2));
  const framesDir = path.join(projectDir, "compositions", "frames");

  console.log(`\nDuration-envelope check for mounted sub-compositions`);

  if (!existsSync(framesDir)) {
    console.log(`  no compositions/frames dir found -- nothing to check.`);
    process.exit(0);
  }

  const frameFiles = readdirSync(framesDir)
    .filter((f) => f.endsWith(".html"))
    .sort();

  let anyFailure = false;
  let anyChecked = false;

  for (const file of frameFiles) {
    const full = path.join(framesDir, file);
    const html = readFileSync(full, "utf-8");
    const mounts = findMounts(html);
    if (mounts.length === 0) continue;

    for (const mount of mounts) {
      const componentPath = path.join(projectDir, mount.src);
      const info = componentInfo(componentPath);
      if (!info || info.native === null || mount.mountDuration === null) {
        console.log(`  ? ${file} -> ${mount.src}: couldn't determine native duration or mount duration, skipped`);
        continue;
      }
      anyChecked = true;
      const over = mount.mountDuration > info.native;
      if (!over) {
        console.log(`  ✓ ${file} -> ${mount.src}: mounted ${mount.mountDuration}s <= native ${info.native}s`);
        continue;
      }
      if (info.elastic) {
        console.log(
          `  ~ ${file} -> ${mount.src}: mounted ${mount.mountDuration}s > native ${info.native}s, but reads root.dataset.duration (elastic HOLD) -- should be safe, worth one visual confirmation`
        );
      } else {
        anyFailure = true;
        console.log(
          `  ✗ ${file} -> ${mount.src}: mounted ${mount.mountDuration}s > native ${info.native}s, and its script never reads root.dataset.duration -- FIXED envelope, will go blank for the extra ${(mount.mountDuration - info.native).toFixed(2)}s`
        );
      }
    }
  }

  if (!anyChecked && !anyFailure) {
    console.log(`  no data-composition-src mounts with both a mount duration and a resolvable native duration found.`);
  }

  if (anyFailure) {
    console.error(`\n✗ FAILED -- one or more sub-mounts are held past their own FIXED native envelope.`);
    console.error(`  Either cap the mount's data-duration at/under the component's own`);
    console.error(`  data-composition-duration, or confirm (and if so, patch the component to`);
    console.error(`  actually use) an elastic root.dataset.duration-driven HOLD.`);
    process.exit(1);
  }

  console.log(`\n✓ PASS -- no sub-mount is held past a fixed native envelope.`);
}

main();
