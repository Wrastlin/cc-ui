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
 * The rail by category, the same five the home page opens (Aaron, 2026-11-04: "if estimating is its own category, it can
 * still have kind of like a section homepage, but then it should have tabs for all those items ... in the sidebar, we
 * have those options available to us"). Each heading opens its section page in the main app; the links open the tools.
 */
export type MenuSection = { id: string; title: string; href: string; links: MenuLink[] };

const SECTIONS: readonly { id: string; title: string; hrefs: readonly string[] }[] = [
  { id: "bricks", title: "Bricks", hrefs: ["/bricks", "/inventory/buy", "/inventory/shop", "/inventory/shop/print"] },
  { id: "trades", title: "Trades", hrefs: ["/gutters"] },
  { id: "jobs", title: "Jobs", hrefs: ["/jobs", "/production", "/folders", "/subcontracts", "/checks", "/time"] },
  { id: "estimating", title: "Estimating", hrefs: ["/estimating/queue", "/commercial"] },
  { id: "sales", title: "Sales and service", hrefs: ["/admin", "/canvass"] },
  { id: "academy", title: "Academy", hrefs: ["/library/index.html", "/record"] },
];

/** What a person's grants open, by category, in rail order; a category with nothing held is left out. */
export function menuSections(apps: readonly string[]): MenuSection[] {
  const { main, more, bricks } = menuFor(apps);
  const held = new Map([...bricks, ...main, ...more].map((l) => [l[1], l] as const));
  return SECTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    href: `/apps/${s.id}`,
    links: s.hrefs.flatMap((h): MenuLink[] => {
      const l = held.get(h);
      return l ? [l] : [];
    }),
  })).filter((s) => s.links.length);
}

/** The category a path sits under, for the tabs across the top of its tools. */
export function sectionFor(apps: readonly string[], path: string): MenuSection | null {
  return menuSections(apps).find((s) => path === s.href || s.links.some(([, h]) => isCurrent(h, path))) ?? null;
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
