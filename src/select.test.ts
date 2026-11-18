import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

// Aaron 11/18: a select's arrow sat against the edge of the box. The control is drawn once here, so its spacing is a
// number a test can hold: our own arrow, set in from the edge, with the text kept clear of it.
const css = readFileSync(new URL("./primitives.css", import.meta.url), "utf8");
const rule = (sel: string) => css.match(new RegExp(`\\n${sel.replace(".", "\\.")} \\{([^}]*)\\}`))?.[1] ?? "";

test("a select draws its own arrow, inset from the edge, with room for it", () => {
  const r = rule(".ui-select");
  assert.match(r, /(^|\s)appearance:\s*none/);
  assert.match(r, /-webkit-appearance:\s*none/);
  const inset = Number(r.match(/background-position:\s*right (\d+)px center/)?.[1] ?? 0);
  const room = Number(r.match(/padding-right:\s*(\d+)px/)?.[1] ?? 0);
  assert.ok(inset >= 12, `arrow ${inset}px from the edge`);
  assert.ok(room >= inset + 20, `text kept ${room}px from the edge`);
});

test("SelectField's button draws one arrow, its own chevron, with room on the right", () => {
  const r = rule(".ui-select-btn");
  assert.match(r, /background-image:\s*none/);
  const room = Number(r.match(/padding-right:\s*(\d+)px/)?.[1] ?? 0);
  assert.ok(room >= 12, `chevron ${room}px from the edge`);
});
