import { test } from "node:test";
import assert from "node:assert/strict";
import { ago, count, date, money, range, time } from "./format.ts";

test("money: column keeps cents, inline drops them on whole dollars, minus for negatives", () => {
  assert.equal(money(1234.5), "$1,234.50");
  assert.equal(money(1200), "$1,200.00");
  assert.equal(money(1200, { inline: true }), "$1,200");
  assert.equal(money(1200.4, { inline: true }), "$1,200.40");
  assert.equal(money(-1234.56), "-$1,234.56");
  assert.equal(money(0), "$0.00");
});

test("money: missing is null, never $0.00", () => {
  assert.equal(money(null), null);
  assert.equal(money(undefined), null);
  assert.equal(money(Number.NaN), null);
});

test("count: singular, plural, given plural, missing", () => {
  assert.equal(count(1, "job"), "1 job");
  assert.equal(count(1204, "job"), "1,204 jobs");
  assert.equal(count(2, "box", "boxes"), "2 boxes");
  assert.equal(count(null, "job"), null);
});

test("date: a bare day stays that day; lengths are named", () => {
  assert.equal(date("2026-12-02"), "Dec 2, 2026");
  assert.equal(date("2026-12-02", "long"), "December 2, 2026");
  assert.equal(date("2026-12-02", "full"), "Wednesday, December 2, 2026");
  assert.equal(date("2026-12-02T03:00:00Z"), "Dec 1, 2026");
  assert.equal(date(""), null);
  assert.equal(date("not a date"), null);
});

test("time: Chicago, no leading zero; a bare day has no time", () => {
  assert.equal(time("2026-11-27T20:40:00Z"), "2:40 PM");
  assert.equal(time("2026-11-27"), null);
});

test("range: says to, year only when needed", () => {
  const now = new Date("2026-11-27T12:00:00Z");
  assert.equal(range("2026-11-03", "2026-11-07", now), "Nov 3 to Nov 7");
  assert.equal(range("2027-01-03", "2027-01-07", now), "Jan 3 to Jan 7, 2027");
  assert.equal(range("2026-12-28", "2027-01-04", now), "Dec 28, 2026 to Jan 4, 2027");
});

test("ago: minutes, hours, days, then the date", () => {
  const now = new Date("2026-11-27T18:00:00Z");
  assert.equal(ago("2026-11-27T17:59:30Z", now), "just now");
  assert.equal(ago("2026-11-27T17:55:00Z", now), "5 minutes ago");
  assert.equal(ago("2026-11-27T17:00:00Z", now), "1 hour ago");
  assert.equal(ago("2026-11-25T18:00:00Z", now), "2 days ago");
  assert.equal(ago("2026-11-10T18:00:00Z", now), "Nov 10, 2026");
  assert.equal(ago(null, now), null);
});
