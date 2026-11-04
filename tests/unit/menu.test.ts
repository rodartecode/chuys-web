import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fullMenu, type MenuCategory } from "@data/menu";
import { describe, expect, it } from "vitest";

// The trimmed Square catalog that `fullMenu` is hand-copied from (BACKLOG B-6).
const CSV_PATH = fileURLToPath(
  new URL("../../docs/menu/square-catalog-2026-11-04.csv", import.meta.url)
);

interface CatalogRow {
  name: string;
  category: string;
}

/** Minimal CSV parser: handles quoted fields with commas and doubled quotes. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

const [header, ...body] = parseCsv(readFileSync(CSV_PATH, "utf8"));
const catalog: CatalogRow[] = body.map(([name, category]) => ({ name, category }));

// Drinks are folded into option lines. Each Square drink maps to exactly one line, so
// "Can Coke" and "Bottled Coke" can't stand in for each other.
const DRINK_PREFIXES: [prefix: string, group: string][] = [
  ["Can ", "Canned sodas"],
  ["Bottled ", "Bottled"],
  ["Jarrito ", "Jarritos"],
];
const UNPREFIXED_DRINKS: Record<string, string> = { Gatorade: "Bottled", Snapple: "Bottled" };

function categoryFor(square: string): MenuCategory {
  const category = fullMenu.find((c) => c.square === square);
  if (!category) throw new Error(`fullMenu has no category for Square category "${square}"`);
  return category;
}

/** Where a catalog row should appear: a plain item, or an option inside a group line. */
function locate(row: CatalogRow): { group?: string; label: string } {
  if (row.category === "Drinks") {
    const prefixed = DRINK_PREFIXES.find(([prefix]) => row.name.startsWith(prefix));
    if (prefixed) return { group: prefixed[1], label: row.name.slice(prefixed[0].length) };
    const group = UNPREFIXED_DRINKS[row.name];
    if (group) return { group, label: row.name };
  }
  return { label: row.name };
}

describe("fullMenu vs the Square catalog", () => {
  it("reads the trimmed catalog", () => {
    expect(header).toEqual(["Item Name", "Category", "Description"]);
    expect(catalog).toHaveLength(44);
  });

  it.each(catalog)("shows $name under $category", (row) => {
    const category = categoryFor(row.category);
    const { group, label } = locate(row);
    if (group) {
      const line = category.items.find((item) => item.name === group);
      expect(line?.options, `"${group}" line in ${category.title}`).toContain(label);
    } else {
      const item = category.items.find((i) => i.name === label);
      expect(item, `"${label}" in ${category.title}`).toBeDefined();
      expect(item?.options).toBeUndefined();
    }
  });

  it("invents nothing: every entry maps back to one catalog row", () => {
    const expected = new Set(catalog.map((row) => JSON.stringify([row.category, locate(row)])));
    const actual = fullMenu.flatMap((category) =>
      category.items.flatMap((item) =>
        item.options
          ? item.options.map((label) =>
              JSON.stringify([category.square, { group: item.name, label }])
            )
          : [JSON.stringify([category.square, { label: item.name }])]
      )
    );
    expect(actual).toHaveLength(catalog.length);
    expect(new Set(actual)).toEqual(expected);
  });

  it("shows no prices", () => {
    expect(JSON.stringify(fullMenu)).not.toMatch(/\$|\d+\.\d{2}/);
  });
});
