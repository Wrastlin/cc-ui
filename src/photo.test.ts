import { test } from "node:test";
import assert from "node:assert/strict";
import { isPhoto, refusal, shrinkSize } from "./photo.ts";

test("photos by type or by extension, HEIC with an empty type included", () => {
  assert.equal(isPhoto("a.jpg", "image/jpeg"), true);
  assert.equal(isPhoto("IMG_0042.HEIC", ""), true);
  assert.equal(isPhoto("notes.pdf", "application/pdf"), false);
  assert.equal(isPhoto("heic", ""), false);
});

test("a refusal names the file and the reason in one sentence", () => {
  assert.equal(refusal("a.jpg", "image/jpeg", 10), null);
  assert.equal(refusal("bill.pdf", "application/pdf"), "bill.pdf is not a photo. Photos can be JPG, HEIC, PNG, WebP, TIFF, GIF, BMP or AVIF.");
  assert.equal(refusal("big.jpg", "image/jpeg", 60 * 1024 * 1024), "big.jpg is over 50 MB.");
});

test("shrink keeps the shape and stops at the long side", () => {
  assert.deepEqual(shrinkSize(4032, 3024), { w: 2048, h: 1536 });
  assert.deepEqual(shrinkSize(3024, 4032), { w: 1536, h: 2048 });
  assert.deepEqual(shrinkSize(800, 600), { w: 800, h: 600 });
});
