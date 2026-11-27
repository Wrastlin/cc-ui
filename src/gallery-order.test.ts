import { test } from "node:test";
import assert from "node:assert/strict";
import { move, withCover } from "./gallery-order.ts";

test("move shifts one item and keeps the rest in order", () => {
  assert.deepEqual(move(["a", "b", "c", "d"], 0, 2), ["b", "c", "a", "d"]);
  assert.deepEqual(move(["a", "b", "c"], 2, 0), ["c", "a", "b"]);
  assert.deepEqual(move(["a", "b"], 0, 5), ["a", "b"]);
});

test("adding keeps the cover; the first photo is the cover only when there is none", () => {
  const p = [{ id: "1" }, { id: "2" }, { id: "3" }];
  assert.equal(withCover({ photos: p, cover: "2" }).cover, "2");
  assert.equal(withCover({ photos: p }).cover, "1");
  assert.equal(withCover({ photos: p, cover: "gone" }).cover, "1");
  assert.equal(withCover({ photos: [] }).cover, undefined);
});
