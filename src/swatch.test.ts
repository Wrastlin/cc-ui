import assert from "node:assert/strict";
import { test } from "node:test";
import { needsEdge } from "./swatch.ts";

test("an edge only on colors under 3:1 on white", () => {
  for (const hex of ["#ffffff", "#fff", "#efe6d2", "#b9b4a6"]) assert.equal(needsEdge(hex), true, hex);
  for (const hex of ["#4a3527", "#000000", "#6b6e70"]) assert.equal(needsEdge(hex), false, hex);
  assert.equal(needsEdge(null), false);
  assert.equal(needsEdge("not a color"), false);
});
