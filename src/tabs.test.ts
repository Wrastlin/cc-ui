import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("a tab never shrinks, so its label never runs into the next (P15, Aaron 11/6)", () => {
  const css = readFileSync(new URL("./shell.css", import.meta.url), "utf8");
  const tab = [...css.matchAll(/^\.cc-tab \{([^}]*)\}/gm)].map((m) => m[1]).join("");
  assert.match(tab, /flex:\s*0 0 auto/);
});

test("row two is a section's own views, never its sibling tools (P15, Aaron 11/9)", async () => {
  const { rowTwo } = await import("./menu.ts");
  const all = ["production", "subcontracts", "checks", "dashboard", "estimating", "commercial", "gutters", "panels", "whiteboard"];
  assert.equal(rowTwo(all, "/time"), null);
  assert.equal(rowTwo(all, "/production"), null);
  assert.equal(rowTwo(all, "/whiteboard"), null);
  assert.ok(rowTwo(all, "/estimating/queue")?.tabs.some((t) => t.label === "Queue" && t.current));
});
