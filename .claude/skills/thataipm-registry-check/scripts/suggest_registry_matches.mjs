#!/usr/bin/env node
// Reads each frame's "Scene:" description straight out of STORYBOARD.md and runs it
// through `hyperframes catalog --query --json` -- the CLI's own real search (local word
// match, or true meaning search with --on-device) -- instead of a human having to scan
// 373 catalog entries by hand or guess which tag to filter by.
//
// This does NOT auto-install anything. Matching a query is not the same as a candidate
// actually fitting this channel's visual identity (a keyword hit on "count-up" can surface
// a block styled nothing like this project's palette) -- picking one is still a judgment
// call for /thataipm-registry-check's step 3, not something safe to automate away.
//
// Usage:
//   node suggest_registry_matches.mjs --project-dir hyperframes-<episode> [--top 3] [--hyperframes-version 0.7.107]

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = { top: 3, hfVersion: "0.7.107" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--project-dir") out.projectDir = argv[++i];
    else if (a === "--top") out.top = Number(argv[++i]);
    else if (a === "--hyperframes-version") out.hfVersion = argv[++i];
  }
  if (!out.projectDir) throw new Error("missing --project-dir <path>");
  out.projectDir = path.resolve(out.projectDir);
  return out;
}

// STORYBOARD.md shape (established across every episode this channel has produced):
//   ## Frame N — Title
//   ...
//   Scene: <prose description of the visual concept for this frame>
function extractScenes(storyboardText) {
  const frames = [];
  const frameBlocks = storyboardText.split(/^## /m).slice(1);
  for (const block of frameBlocks) {
    const titleLine = block.split("\n")[0].trim();
    const sceneMatch = block.match(/^Scene:\s*(.+?)(?:\n\n|\n$|$)/ms);
    if (sceneMatch) {
      // Scene descriptions run multi-sentence and multi-line in this project's
      // STORYBOARD.md convention -- collapse to one line for a clean query string.
      const scene = sceneMatch[1].replace(/\s+/g, " ").trim();
      frames.push({ title: titleLine, scene });
    }
  }
  return frames;
}

// Strip the parenthetical timing/annotation noise this project's STORYBOARD.md Scene:
// prose is full of ("(0.9s)", "(2.11s, negative emphasis)") -- it's real content for a
// human reading the storyboard, but it dilutes a word-match query into mostly numbers
// and stage directions instead of the visual concept the query is actually about.
function cleanQuery(text) {
  return text
    .replace(/\([^)]*\)/g, " ")
    .replace(/["""]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function queryCatalog(query, hfVersion, top) {
  // shell:true + an args array triggers Node's unescaped-args deprecation warning on
  // Windows; a single pre-quoted command string avoids it while still resolving npx
  // through the shell the way this project's other scripts do.
  const quoted = query.replace(/"/g, '\\"');
  const cmd = `npx hyperframes@${hfVersion} catalog --query "${quoted}" --json`;
  const r = spawnSync(cmd, { encoding: "utf-8", shell: true, maxBuffer: 10 * 1024 * 1024 });
  if (r.status !== 0) {
    return { error: r.stderr || `exit ${r.status}` };
  }
  try {
    const parsed = JSON.parse(r.stdout);
    return { results: (parsed.results || []).slice(0, top), tier: parsed.tier_detail };
  } catch {
    return { error: "could not parse catalog --json output" };
  }
}

function main() {
  const { projectDir, top, hfVersion } = parseArgs(process.argv.slice(2));
  const storyboardPath = path.join(projectDir, "STORYBOARD.md");
  if (!existsSync(storyboardPath)) {
    throw new Error(`no STORYBOARD.md at ${storyboardPath}`);
  }

  const frames = extractScenes(readFileSync(storyboardPath, "utf-8"));
  if (!frames.length) {
    console.log("No \"Scene:\" descriptions found in STORYBOARD.md -- nothing to query.");
    return;
  }

  console.log(`\nRegistry candidates per frame, from STORYBOARD.md's own Scene: text`);
  console.log(`(search tier depends on whether --on-device was set up for this machine)\n`);

  for (const { title, scene } of frames) {
    const query = cleanQuery(scene);
    console.log(`── ${title}`);
    console.log(`   query: "${query.slice(0, 100)}${query.length > 100 ? "…" : ""}"`);
    const { results, error, tier } = queryCatalog(query, hfVersion, top);
    if (error) {
      console.log(`   ! query failed: ${error}`);
      continue;
    }
    if (!results.length) {
      console.log(`   (no matches)`);
    } else {
      console.log(`   [${tier}]`);
      for (const r of results) {
        console.log(`   - ${r.name} (${r.type}) — ${r.title}`);
        console.log(`     ${r.description}`);
      }
    }
    console.log("");
  }

  console.log(
    "Matching a query is not the same as fitting this channel's visual identity --" +
    "\nreview each candidate against the palette/tone/schema-vocabulary before installing," +
    "\nand log a real entry in docs/hyperframes_production_notes.md for anything that" +
    "\ngenuinely doesn't fit, per /thataipm-registry-check step 4."
  );
}

main();
