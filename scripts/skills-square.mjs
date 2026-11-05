// Installs the Square CLI's bundled agent skills into this project, trimmed to the few we use.
//
// `square skills add --no-global` always syncs every bundled skill (~107) into .agents/skills/
// and symlinks them into .claude/skills/. That's ~5k tokens of skill descriptions per session,
// so this keeps only KEEP and removes the rest. Both folders are gitignored: the skills are
// Square's proprietary files and this repo is public. Re-run on each machine, and after
// upgrading the CLI.
import { execSync } from "node:child_process";
import { existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const KEEP = new Set([
  "square", // router: indexes the domain skills
  "square-cli", // cross-cutting CLI conventions (auth, output, pagination, --force)
  "square-catalog", // items, categories, menus, images
  "square-locations", // hours, address, phone
  "square-reporting", // sales analytics
  "square-online", // Square Online / ordering links
]);
const DIRS = [".claude/skills", ".agents/skills"]; // links first, then their targets

// A command string (not an args array) because `square` is a .cmd shim on Windows, which needs a shell.
execSync("square skills add --no-global", { stdio: "inherit" });

let removed = 0;
for (const dir of DIRS) {
  if (!existsSync(dir)) continue;
  for (const name of readdirSync(dir)) {
    const isSquare = name === "apps" || name.startsWith("square");
    if (!isSquare || KEEP.has(name)) continue;
    rmSync(join(dir, name), { recursive: true, force: true }); // removes a symlink, not its target
    removed++;
  }
}

const kept = existsSync(DIRS[1]) ? readdirSync(DIRS[1]).filter((n) => KEEP.has(n)) : [];
console.log(`\nKept ${kept.length} Square skills (${kept.join(", ")}); pruned ${removed} entries.`);
if (kept.length !== KEEP.size) {
  console.error(`Expected ${KEEP.size}. A skill in KEEP may have been renamed upstream.`);
  process.exit(1);
}
