// Regenerates the trimmed Square catalog that `fullMenu` in src/data/menu.ts is checked against
// (tests/unit/menu.test.ts). Read-only against Square. Writes `Item Name,Category,Description` with
// no prices, because this repo is public.
//
// Needs the Square CLI signed in (`square auth login`, browser OAuth). It can't run in CI or
// Workers Builds, so the CSV is committed and `pnpm test` reads the committed copy.
//
// Usage: pnpm menu:pull [out.csv]   (default: docs/menu/square-catalog.csv)
//
// Which items count as "on the menu": not archived, and sold in at least one ACTIVE channel other
// than Point of Sale (Cash App ordering, Uber Eats, Grubhub, ...). Checked on 2026-11-05: across all
// 63 items, this rule matched the export's "Square Online Item Visibility" column with 0 mismatches.
// Category is the item's reporting category, the same as the export's "Categories" column.
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2] ?? "docs/menu/square-catalog.csv";

/** Runs a read-only square command and parses its JSON output. */
function square(args) {
  // A command string (not an args array) because `square` is a .cmd shim on Windows, which needs a shell.
  const out = execSync(`square ${args} --format json`, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    stdio: ["ignore", "pipe", "inherit"],
  });
  return JSON.parse(out);
}

const auth = square("auth status");
if (!auth.signedIn || auth.reauthRequired) {
  console.error("Square CLI isn't signed in. Run `square auth login`, then retry.");
  process.exit(1);
}

const items = square("catalog catalog-object list --object-types ITEM --all").objects ?? [];
const categories =
  square("catalog catalog-object list --object-types CATEGORY --all").objects ?? [];
const channels = square("channels channel list --all").objects ?? [];
if (items.length === 0 || categories.length === 0 || channels.length === 0) {
  console.error(
    `Empty response (items ${items.length}, categories ${categories.length}, channels ${channels.length}).`
  );
  process.exit(1);
}

const categoryName = new Map(categories.map((c) => [c.id, c.categoryData.name]));
const sellingChannels = new Set(
  channels.filter((c) => c.status === "ACTIVE" && c.name !== "Point of Sale").map((c) => c.id)
);

const rows = items
  .filter((o) => !o.isDeleted && !o.itemData.isArchived)
  .filter((o) => (o.itemData.channels ?? []).some((id) => sellingChannels.has(id)))
  .map((o) => {
    const d = o.itemData;
    const category = categoryName.get(d.reportingCategory?.id);
    if (!category) throw new Error(`"${d.name}" has no reporting category`);
    return [d.name, category, d.description ?? ""];
  })
  // Category, then name, in code-unit order (same order as the original hand export).
  .sort((a, b) => cmp(a[1], b[1]) || cmp(a[0], b[0]));

function cmp(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function csvField(value) {
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

const csv = [["Item Name", "Category", "Description"], ...rows]
  .map((row) => row.map(csvField).join(","))
  .join("\n");
writeFileSync(OUT, `${csv}\n`);
console.log(`Wrote ${rows.length} items to ${OUT} (of ${items.length} in the catalog).`);
