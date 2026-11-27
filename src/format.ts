// The one place numbers, money and dates become text (gap 15b). cc-app has four functions named money with four
// behaviors (one prints a missing amount as "$0.00"); every app reads this instead. A missing value returns null and
// the part shows a word for it (MoneyText: "Not set"), never a zero. Dates are named lengths in Chicago time, never a
// hand-built string; ranges use "to", which a screen reader says, not a hyphen.

const TZ = "America/Chicago";
type Num = number | null | undefined;
type When = string | Date | null | undefined;

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdWhole = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const int = new Intl.NumberFormat("en-US");

function ok(n: Num): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

/**
 * "$1,234.56"; "-$1,234.56" for a negative (a minus is read aloud). In a column whole dollars keep ".00" so the
 * decimals line up; `inline` drops it in a sentence ("$1,200 left"). Missing is null.
 */
export function money(n: Num, opts: { inline?: boolean } = {}): string | null {
  if (!ok(n)) return null;
  const whole = opts.inline && Number.isInteger(n);
  const s = (whole ? usdWhole : usd).format(Math.abs(n));
  return n < 0 ? `-${s}` : s;
}

/** "1 job", "1,204 jobs". The plural is given when it is not noun + s ("box", "boxes"). */
export function count(n: Num, noun: string, plural = `${noun}s`): string | null {
  if (!ok(n)) return null;
  return `${int.format(n)} ${n === 1 ? noun : plural}`;
}

// A bare "2026-12-02" is a calendar day, not midnight UTC (which is the evening before in Chicago).
function parse(v: When): { d: Date; day: boolean } | null {
  if (v == null || v === "") return null;
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : { d: v, day: false };
  const day = /^\d{4}-\d{2}-\d{2}$/.test(v);
  const d = new Date(day ? `${v}T12:00:00Z` : v);
  return Number.isNaN(d.getTime()) ? null : { d, day };
}

const DATE_OPTS = {
  medium: { month: "short", day: "numeric", year: "numeric" },
  long: { month: "long", day: "numeric", year: "numeric" },
  full: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
} as const;

/** "Dec 2, 2026" (medium), "December 2, 2026" (long), "Wednesday, December 2, 2026" (full). */
export function date(v: When, length: keyof typeof DATE_OPTS = "medium"): string | null {
  const p = parse(v);
  if (!p) return null;
  return new Intl.DateTimeFormat("en-US", { ...DATE_OPTS[length], timeZone: p.day ? "UTC" : TZ }).format(p.d);
}

/** "2:40 PM", no leading zero. */
export function time(v: When): string | null {
  const p = parse(v);
  if (!p || p.day) return null;
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ }).format(p.d);
}

/** "Nov 3 to Nov 7"; the year once at the end when both share it and it is not this year. */
export function range(a: When, b: When, now: Date = new Date()): string | null {
  const pa = parse(a);
  const pb = parse(b);
  if (!pa || !pb) return null;
  const year = (p: { d: Date; day: boolean }) =>
    Number(new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: p.day ? "UTC" : TZ }).format(p.d));
  const md = (p: { d: Date; day: boolean }, withYear: boolean) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      ...(withYear ? { year: "numeric" } : {}),
      timeZone: p.day ? "UTC" : TZ,
    }).format(p.d);
  const ya = year(pa);
  const yb = year(pb);
  const thisYear = Number(new Intl.DateTimeFormat("en-US", { year: "numeric", timeZone: TZ }).format(now));
  if (ya === yb) return `${md(pa, false)} to ${md(pb, ya !== thisYear)}`;
  return `${md(pa, true)} to ${md(pb, true)}`;
}

/** "just now", "5 minutes ago", "3 hours ago", "2 days ago"; past a week, the medium date. */
export function ago(v: When, now: Date = new Date()): string | null {
  const p = parse(v);
  if (!p) return null;
  const s = Math.round((now.getTime() - p.d.getTime()) / 1000);
  if (s < 0) return date(v);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return count(m, "minute") + " ago";
  const h = Math.floor(m / 60);
  if (h < 24) return count(h, "hour") + " ago";
  const d = Math.floor(h / 24);
  if (d < 7) return count(d, "day") + " ago";
  return date(v);
}
