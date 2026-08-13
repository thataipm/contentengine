#!/usr/bin/env node
// thataipm-distribute: mechanical checks on captions.md before scheduling.
// Encodes two standing rules that have each been flagged directly by the user
// more than once: no em dashes anywhere, and every platform's caption must be
// genuinely distinct text, not the VO script reused or lightly paraphrased.
//
// Usage: node lint_captions.mjs --captions episodes/<slug>/assets/captions.md

import { readFileSync } from "node:fs";
import path from "node:path";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--captions") out.captions = argv[++i];
  }
  if (!out.captions) throw new Error("missing --captions <path>");
  return out;
}

// Splits on "## <Platform>" headers (Instagram / LinkedIn / YouTube, any case).
function splitPlatforms(text) {
  const parts = text.split(/^##\s+/m).slice(1);
  return parts.map((p) => {
    const [title, ...rest] = p.split("\n");
    return { title: title.trim(), body: rest.join("\n").trim() };
  });
}

function tokenSet(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3) // skip short/common words for a meaningful overlap signal
  );
}

function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

function findDashHits(text) {
  return text.split(/\r?\n/).filter((l) => /[—–]/.test(l) || / -- /.test(l));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const text = readFileSync(path.resolve(args.captions), "utf-8");
  const platforms = splitPlatforms(text);

  let failed = false;
  console.log(`Checking ${path.resolve(args.captions)} (${platforms.length} platform section(s))\n`);

  const dashHits = findDashHits(text);
  if (dashHits.length) {
    failed = true;
    console.log(`✗ em/en dash found (${dashHits.length}):`);
    dashHits.forEach((l) => console.log("    " + l.trim()));
  } else {
    console.log("✓ no em/en dashes");
  }

  if (platforms.length < 2) {
    console.log("⚠ fewer than 2 platform sections found — skipping distinctness check (is the ## header format right?)");
  } else {
    console.log("\nPairwise distinctness (word-overlap similarity, lower is more distinct):");
    let anyTooSimilar = false;
    for (let i = 0; i < platforms.length; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        const sim = jaccard(tokenSet(platforms[i].body), tokenSet(platforms[j].body));
        const tooSimilar = sim > 0.5;
        if (tooSimilar) anyTooSimilar = true;
        console.log(
          `  ${tooSimilar ? "✗" : "✓"} ${platforms[i].title} vs ${platforms[j].title}: ${(sim * 100).toFixed(0)}% overlap${tooSimilar ? "  <- too similar, rewrite one" : ""}`
        );
      }
    }
    if (anyTooSimilar) {
      failed = true;
      console.log(
        "\n  Standing rule: even paraphrasing the same sentences counts as \"same\" — write genuinely fresh copy per platform, not a reworded VO script."
      );
    }
  }

  console.log(`\n${failed ? "✗ FAIL" : "✓ PASS"}`);
  process.exit(failed ? 1 : 0);
}

main();
