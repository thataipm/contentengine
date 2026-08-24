#!/usr/bin/env node
// Real check for "raw-url-resolves". Zernio needs a real public GitHub-raw URL to fetch
// the video/cover from at publish time and can't retry a broken URL later -- this was a
// manual curl step in thataipm-distribute SKILL.md, now a real gate.
//
// Not derivable from --project-dir alone (the URLs only exist after a real git push) --
// takes them explicitly.
//
// Usage: node check_raw_urls.mjs --video-url <url> --cover-url <url>

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--video-url") out.videoUrl = argv[++i];
    else if (argv[i] === "--cover-url") out.coverUrl = argv[++i];
  }
  if (!out.videoUrl || !out.coverUrl) throw new Error("missing --video-url <url> and/or --cover-url <url>");
  return out;
}

async function checkUrl(label, url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const ok = res.status === 200;
    console.log(`  ${ok ? "✓" : "✗"} ${label}: ${res.status} ${url}`);
    return ok;
  } catch (err) {
    console.log(`  ✗ ${label}: request failed (${err.message}) ${url}`);
    return false;
  }
}

async function main() {
  const { videoUrl, coverUrl } = parseArgs(process.argv.slice(2));
  console.log(`\nRaw URL check`);

  const videoOk = await checkUrl("video", videoUrl);
  const coverOk = await checkUrl("cover", coverUrl);

  if (videoOk && coverOk) {
    console.log(`\n✓ PASS -- both URLs resolve.`);
    process.exit(0);
  }

  console.error(`\n✗ FAIL -- Zernio cannot retry a broken URL later. Fix the push/publish step and re-check`);
  console.error(`  before scheduling.`);
  process.exit(1);
}

main();
