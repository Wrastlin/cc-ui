import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// 11/20: Resolutions went on the menu with no icon and sat bare among the others. Every tab on the menu has one.
test("every menu tab has an icon", () => {
  const menu = readFileSync(new URL("./menu.ts", import.meta.url), "utf8");
  const side = readFileSync(new URL("./SideMenu.tsx", import.meta.url), "utf8");
  const icons = new Set([...side.matchAll(/"(\/[^"]*)":\s*[A-Z]\w*/g)].map((m) => m[1]));
  const tabs = [...menu.matchAll(/\{\s*label:\s*"[^"]+",\s*href:\s*"(\/[^"]*)"/g)].map((m) => m[1]);
  assert.ok(tabs.length > 10);
  assert.deepEqual(tabs.filter((h) => !icons.has(h)), []);
});
