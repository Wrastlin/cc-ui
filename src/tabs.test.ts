import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("a tab never shrinks, so its label never runs into the next (P15, Aaron 11/6)", () => {
  const css = readFileSync(new URL("./shell.css", import.meta.url), "utf8");
  const tab = [...css.matchAll(/^\.cc-tab \{([^}]*)\}/gm)].map((m) => m[1]).join("");
  assert.match(tab, /flex:\s*0 0 auto/);
});
