import { test } from "node:test";
import assert from "node:assert/strict";
import { nextOpen } from "./review.ts";

const open = (x: { done: boolean }) => !x.done;

test("a decision moves to the next open item, skipping done ones", () => {
  const items = [{ done: false }, { done: true }, { done: false }];
  assert.equal(nextOpen(items, 0, open), 2);
});

test("it wraps to an open item before the current one", () => {
  const items = [{ done: false }, { done: true }, { done: false }];
  assert.equal(nextOpen(items, 2, open), 0);
});

test("none left reads -1, the current item not counted", () => {
  assert.equal(nextOpen([{ done: false }, { done: true }], 0, open), -1);
  assert.equal(nextOpen([], 0, open), -1);
});
