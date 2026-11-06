import { test } from "node:test";
import assert from "node:assert/strict";
import { SECTION_HREFS, menuFor, menuSections, sectionTabs } from "./menu.ts";

// Every grant there is, so the check sees the whole menu.
const ALL = ["dashboard", "checks", "production", "gutters", "crmp", "canvass", "subcontracts", "estimating",
  "commercial", "bricks", "inventory", "academy"];

test("each destination sits in exactly one section (PATTERNS P15)", () => {
  const seen = new Set<string>();
  for (const h of SECTION_HREFS) {
    assert.ok(!seen.has(h), `${h} is in two sections`);
    seen.add(h);
  }
});

test("every menu link is reached from a section", () => {
  const { main, more, bricks } = menuFor(ALL);
  for (const [label, href] of [...main, ...more, ...bricks]) {
    assert.ok(sectionTabs(ALL, href), `${label} (${href}) sits in no section`);
  }
});

test("estimating holds every kind of estimate, and its tools show its tabs", () => {
  const est = menuSections(ALL).find((s) => s.id === "estimating");
  assert.deepEqual(est?.links.map(([l]) => l), ["Queue", "Residential", "Insurance", "Commercial", "Plan bids", "Gutters"]);
  assert.equal(sectionTabs(ALL, "/estimating/queue")?.section.id, "estimating");
  assert.deepEqual(sectionTabs(ALL, "/estimating/queue")?.tabs.filter((t) => t.current).map((t) => t.label), ["Queue"]);
  assert.equal(sectionTabs(ALL, "/commercial")?.section.id, "estimating");
  const res = sectionTabs(ALL, "/core/estimating", "?p=residential");
  assert.deepEqual(res?.tabs.filter((t) => t.current).map((t) => t.label), ["Residential"]);
  assert.equal(sectionTabs(ALL, "/core/estimating")?.tabs.some((t) => t.current), false);
});

test("grants still decide what shows", () => {
  // Time has no grant, so Jobs is always there; the rest follow what the person holds.
  assert.deepEqual(menuSections(["crmp"]).map((s) => s.id), ["jobs", "sales"]);
  assert.deepEqual(menuSections(["crmp"])[0].links.map(([l]) => l), ["Time"]);
});
