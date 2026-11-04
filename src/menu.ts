/*
 * The one side menu, the list behind it. Every C&C app draws its rail from here (Aaron, 2026-10-15: "Yes, one menu
 * everywhere"), so Subcontracts, Material orders and Shop show the same links as the main app, in the same order.
 *
 * The Dashboard, Money, Status and Sales Management came off 2026-11-01 (Aaron: "apps are for tools, and these are
 * things that we can query if we need to").
 *
 * Each link carries the grant that opens it, and the rail shows only what the person holds (Aaron, 2026-09-29, on
 * James and Brauley: "sales management doesnt need to be shown for them, since thats admin work"). The page itself
 * still turns away anyone without the grant; this keeps a link that bounces off the rail.
 */

export type MenuLink = readonly [label: string, href: string];

// Off the menu 11/4 (Aaron: "remove all those so it's easier to share"), by 30 days of team opens: Contacts, Forms, PDF
// editor, Templates, Tasks, Upload and Metal panels 0, Rotation 1; Sim is off; Zoho opens from Bricks' own menu. Every
// route still answers. Back on the menu is one line.
const MAIN = [
  // Jobs has no grant of its own; the dashboard grant reveals it (cc-app lib/app-urls.ts).
  ["Jobs", "/jobs", "dashboard"],
  // Each job's money from every system side by side, and where two records disagree (Aaron, 2026-10-15). The
  // "checks" grant is not stored: cc-app adds it for the people who see job dollars (lib/calendar/access canSeeMoney).
  ["Checks", "/checks", "checks"],
  ["Production", "/production", "production"],
  // Each gutter job's work order, the picker on the house, ABC parts and the crew's costs (Aaron, 2026-10-16).
  ["Gutters", "/gutters", "gutters"],
  // The paper job folders, each opened by the QR tag taped to it; the production grant opens them (Aaron, 2026-10-09).
  ["Job folders", "/folders", "production"],
  ["CRMP", "/admin", "crmp"],
  ["Canvass", "/canvass", "canvass"],
  ["Subcontracts", "/subcontracts", "subcontracts"],
  // Daily log (/tracking) is deliberately not here since 2026-09-16: no one opened it. Putting it back is one line.
  ["Estimates", "/estimating/queue", "estimating"],
  ["Commercial", "/commercial", "commercial"],
] as const;

// The rail is the everyday tools only (Aaron, 2026-10-26: "our app is an absolute mess ... i dont really know how to
// navigate"). Picked from 30 days of opens by the team, Aaron's own left out. Everything else sits under More, still one
// click away (2026-10-19: "hide the others in a 'more' tab so i can access them still"). Back on the rail is one line.
const EVERYDAY = new Set<string>([
  "/jobs", "/production", "/gutters", "/subcontracts", "/estimating/queue", "/canvass",
]);

// Kept on the Bricks heading; its other links go under More with the rest.
const BRICKS_RAIL = new Set<string>(["/bricks", "/inventory/buy", "/inventory/shop"]);

// Under the Bricks heading (Aaron, 2026-10-22): Bricks is the warehouse, and it is taking over the shop, the material
// orders and Zoho from C&C. Each keeps the grant that opened it.
const BRICKS = [
  ["Bricks Hardware", "/bricks", "bricks"],
  ["Shop", "/inventory/shop", "inventory"],
  ["Material orders", "/inventory/buy", "inventory"],
  // The Epson at the shop: the office uploads PDFs, the QR on the printer opens them to print (Aaron, 2026-10-20).
  ["Shop printer", "/inventory/shop/print", "inventory"],
] as const;

const ALL = [...MAIN, ...BRICKS];

/** What a person's grants open, in rail order: the main list, the rest under More, and the Bricks links apart. */
export function menuFor(apps: readonly string[]): { main: MenuLink[]; more: MenuLink[]; bricks: MenuLink[] } {
  const rail: MenuLink[] = [
    // How C&C does its work, every trade and procedure with the manufacturer standards (SOP/, Aaron 10/18; named Academy 10/19, the path kept).
    // Admins only while it is built (Aaron, 2026-10-19); cc-app adds the "academy" grant (lib/library/access withAcademy).
    ...(apps.includes("academy") ? [["Academy", "/library/index.html"] as const] : []),
    // Record a process (screen and voice, or a dropped recording) into SOP steps (cc-app /record, Aaron 10/19).
    ...(apps.includes("academy") ? [["Record", "/record"] as const] : []),
    // Time has no grant: everyone has hours and time off. Email left the app 11/1 (cc-app #490).
    ["Time", "/time"],
    ...MAIN.filter(([, , app]) => apps.includes(app)).map(
      ([l, h]) => [l, h] as const,
    ),
  ];
  const held = BRICKS.filter(([, , app]) => apps.includes(app)).map(([l, h]): MenuLink => [l, h]);
  const main = rail.filter(([, h]) => EVERYDAY.has(h));
  const more = [...rail.filter(([, h]) => !EVERYDAY.has(h)), ...held.filter(([, h]) => !BRICKS_RAIL.has(h))];
  const bricks = held.filter(([, h]) => BRICKS_RAIL.has(h));
  return { main, more, bricks };
}

/**
 * The one map of the app (Design-Lead/PATTERNS.md P15). Home, the side menu, the phone menu and the tabs across every
 * page draw from this list and nothing else (Aaron, 2026-11-04: "Estimating itself should be its own kind of major
 * section ... Residential, insurance, commercial, Swiderski, gutters, all that stuff can be baked into estimating").
 * A section's heading opens its home; its tabs are the kinds of work inside it; `under` is every path it owns, so a
 * tool reached from a row (the queue, the roof markup) still shows its section's tabs.
 */
export type SectionTab = { label: string; href: string; grant?: string };
export type MenuSection = { id: string; title: string; href: string; links: MenuLink[] };
export type SectionTabs = { section: MenuSection; tabs: { label: string; href: string; current: boolean }[] };

type SectionDef = { id: string; title: string; home: string; tabs: readonly SectionTab[]; under?: readonly string[] };

const SECTIONS: readonly SectionDef[] = [
  {
    id: "bricks", title: "Bricks", home: "/apps/bricks",
    tabs: [
      { label: "Bricks Hardware", href: "/bricks", grant: "bricks" },
      { label: "Material orders", href: "/inventory/buy", grant: "inventory" },
      { label: "Shop", href: "/inventory/shop", grant: "inventory" },
      { label: "Shop printer", href: "/inventory/shop/print", grant: "inventory" },
    ],
  },
  {
    id: "jobs", title: "Jobs", home: "/apps/jobs",
    tabs: [
      { label: "Jobs", href: "/jobs", grant: "dashboard" },
      { label: "Production", href: "/production", grant: "production" },
      { label: "Job folders", href: "/folders", grant: "production" },
      { label: "Subcontracts", href: "/subcontracts", grant: "subcontracts" },
      { label: "Checks", href: "/checks", grant: "checks" },
      { label: "Time", href: "/time" },
    ],
  },
  {
    id: "estimating", title: "Estimating", home: "/core/estimating",
    tabs: [
      { label: "Residential", href: "/core/estimating?p=residential", grant: "estimating" },
      { label: "Insurance", href: "/core/estimating?p=insurance", grant: "estimating" },
      { label: "Commercial", href: "/core/estimating?p=commercial", grant: "commercial" },
      { label: "Plan bids", href: "/core/estimating?p=plan_bid", grant: "estimating" },
      { label: "Gutters", href: "/gutters", grant: "gutters" },
    ],
    under: ["/estimating", "/commercial", "/core/estimating"],
  },
  {
    id: "sales", title: "Sales and service", home: "/apps/sales",
    tabs: [
      { label: "CRMP", href: "/admin", grant: "crmp" },
      { label: "Canvass", href: "/canvass", grant: "canvass" },
    ],
  },
  {
    id: "academy", title: "Academy", home: "/apps/academy",
    tabs: [
      { label: "Academy", href: "/library/index.html", grant: "academy" },
      { label: "Record", href: "/record", grant: "academy" },
    ],
  },
];

/** Every destination the map names, for the check that each sits in exactly one section. */
export const SECTION_HREFS: readonly string[] = SECTIONS.flatMap((s) => s.tabs.map((t) => t.href));

const pathOf = (href: string) => href.split("?")[0];
const under = (h: string, path: string) => path === h || path.startsWith(`${h}/`);

/** The sections a person's grants open, in order; a section with no tab held is left out. */
export function menuSections(apps: readonly string[]): MenuSection[] {
  return SECTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    href: s.home,
    links: s.tabs.filter((t) => !t.grant || apps.includes(t.grant)).map((t): MenuLink => [t.label, t.href]),
  })).filter((s) => s.links.length);
}

/**
 * The section a page sits in and its tabs, the current one marked. A tab with a query is current only when the page's
 * query matches it, so the Estimating home shows every estimate with no tab lit.
 */
export function sectionTabs(apps: readonly string[], path: string, search = ""): SectionTabs | null {
  const q = new URLSearchParams(search);
  const def = SECTIONS.find(
    (s) => path === s.home || s.tabs.some((t) => under(pathOf(t.href), path)) || (s.under ?? []).some((h) => under(h, path)),
  );
  const section = def && menuSections(apps).find((m) => m.id === def.id);
  if (!def || !section) return null;
  const tabs = section.links.map(([label, href]) => {
    const [p, query] = href.split("?");
    const current = query
      ? path === p && [...new URLSearchParams(query)].every(([k, v]) => q.get(k) === v)
      : under(p, path);
    return { label, href, current };
  });
  return { section, tabs };
}

/**
 * The menu's own name for the screen a path sits under, grants aside, so a back link reads the way the rail does.
 * Longest match wins: /inventory/shop is Shop, not Material orders.
 */
export function menuLabel(path: string): string | null {
  const all: (readonly [string, string])[] = [
    ["Library", "/library"], ["Time", "/time"], ["Tasks", "/tasks"], ["Upload", "/inventory/upload"],
    ...ALL.map(([l, h]) => [l, h] as const),
  ];
  let best: string | null = null;
  let len = 0;
  for (const [l, h] of all) {
    if ((path === h || path.startsWith(`${h}/`)) && h.length > len) {
      best = l;
      len = h.length;
    }
  }
  return best;
}

/** A link lights for the pages under it too, unless a longer link owns them. */
export function isCurrent(href: string, path: string): boolean {
  const under = (h: string) => path === h || path.startsWith(`${h}/`);
  return under(href) && !ALL.some(([, h]) => h.length > href.length && h.startsWith(`${href}/`) && under(h));
}

/** The fold is kept in this browser under one key, so it holds as you cross from one app to the next. */
export const MENU_FOLD_KEY = "sh-fold";
