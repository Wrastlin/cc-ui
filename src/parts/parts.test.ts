import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = fileURLToPath(new URL(".", import.meta.url));
const gallery = join(dir, "../../gallery");
const sources = [
  ...readdirSync(dir).filter((f) => f.endsWith(".tsx") || f === "cx.ts").map((f) => join(dir, f)),
  ...readdirSync(gallery).map((f) => join(gallery, f)),
];
const read = (p: string) => readFileSync(p, "utf8");

test("parts use the cc colors only: no stock gray, no second blue", () => {
  const stock = /\b(?:bg|text|border|outline|ring|fill|stroke|divide|shadow)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|blue|sky|indigo|white|black)\b/;
  for (const f of sources) assert.doesNotMatch(read(f), stock, f);
});

test("names wrap: no truncate or line clamp (A7)", () => {
  for (const f of sources) assert.doesNotMatch(read(f), /\b(?:truncate|line-clamp-\d|text-ellipsis)\b/, f);
});

test("no hand-typed hex in a part; values come from tokens", () => {
  for (const f of sources) assert.doesNotMatch(read(f), /#[0-9a-fA-F]{3,8}\b/, f);
});

test("every token parts.css reads is defined in tokens.css", () => {
  const tokens = read(join(dir, "../tokens.css"));
  const used = [...read(join(dir, "../parts.css")).matchAll(/var\((--cc-[a-z0-9-]+)\)/g)].map((m) => m[1]);
  assert.ok(used.length > 20);
  for (const t of new Set(used)) assert.match(tokens, new RegExp(`${t}:`), t);
});

test("only the four type sizes and the page size are used", () => {
  for (const f of sources) {
    const sizes = [...read(f).matchAll(/\btext-cc-([a-z]+)\b/g)].map((m) => m[1]);
    for (const s of sizes) {
      assert.ok(
        ["meta", "body", "input", "title", "page", "text", "muted", "faint", "accent", "bg", "danger", "good", "warn"].includes(s),
        `${f}: text-cc-${s}`,
      );
    }
  }
});

test("each adapted file names its source and license", () => {
  for (const f of sources.filter((p) => p.startsWith(dir))) {
    const s = read(f);
    if (/react-aria-components/.test(s) && !/Section|Panel|useNarrow|cx\.ts/.test(f)) {
      assert.match(s, /Apache-2\.0|MIT/, f);
    }
  }
});
