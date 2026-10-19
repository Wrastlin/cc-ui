/*
 * The one side menu, the list behind it. Every C&C app draws its rail from here (Aaron, 2026-10-15: "Yes, one menu
 * everywhere"), so Subcontracts, Material orders and Shop show the same links as the main app, in the same order.
 *
 * Each link carries the grant that opens it, and the rail shows only what the person holds (Aaron, 2026-09-29, on
 * James and Brauley: "sales management doesnt need to be shown for them, since thats admin work"). The page itself
 * still turns away anyone without the grant; this keeps a link that bounces off the rail.
 */

export type MenuLink = readonly [label: string, href: string];

const MAIN = [
  ["Dashboard", "/dashboard", "dashboard"],
  // Jobs has no grant of its own; the dashboard grant reveals it (cc-app lib/app-urls.ts).
  ["Jobs", "/jobs", "dashboard"],
  // JobNimbus's invoices, payments, estimates, proposals and material orders, read only (parity piece 5).
  ["Money", "/money", "dashboard"],
  // Each job's money from every system side by side, and where two records disagree (Aaron, 2026-10-15). The
  // "checks" grant is not stored: cc-app adds it for the people who see job dollars (lib/calendar/access canSeeMoney).
  ["Checks", "/checks", "checks"],
  ["Contacts", "/contacts", "dashboard"],
  // Bricks' Zoho Books, read only, from the watcher's copy.
  ["Zoho", "/zoho", "dashboard"],
  ["Forms", "/forms", "dashboard"],
  ["PDF editor", "/pdf", "dashboard"],
  ["Templates", "/templates", "dashboard"],
  // Aaron, 2026-09-15: "call this Sales Management".
  ["Sales Management", "/review", "sales"],
  ["Production", "/production", "production"],
  // Each gutter job's work order, the picker on the house, ABC parts and the crew's costs (Aaron, 2026-10-16).
  ["Gutters", "/gutters", "gutters"],
  // The paper job folders, each opened by the QR tag taped to it; the production grant opens them (Aaron, 2026-10-09).
  ["Job folders", "/folders", "production"],
  ["CRMP", "/admin", "crmp"],
  ["Canvass", "/canvass", "canvass"],
  ["Rotation", "/inspection-rotation", "inspection-rotation"],
  ["Subcontracts", "/subcontracts", "subcontracts"],
  ["Material orders", "/inventory/buy", "inventory"],
  ["Shop", "/inventory/shop", "inventory"],
  ["Metal panels", "/panels", "panels"],
  ["Marketing", "/marketing", "marketing"],
  ["Sim", "/sim", "sim"],
  // Daily log (/tracking) is deliberately not here since 2026-09-16: no one opened it. Putting it back is one line.
  ["Estimates", "/estimating/queue", "estimating"],
  ["Commercial", "/commercial", "commercial"],
] as const;

// Off the menu since 2026-10-18: no one but Aaron opened any of them in 30 days (activity, page.open), and his own
// walk-through found them hard to use (Aaron: "My app is supposed to be a collection of tools"). The pages still work
// by link and keep their data; putting one back is deleting its line here.
const UNUSED = new Set<string>([
  "/tasks", "/time", "/money", "/checks", "/contacts", "/zoho", "/forms", "/pdf", "/templates", "/marketing", "/sim",
]);

// Watch and /production replace these two (Aaron, 2026-09-28). Hidden only for people who hold Watch.
const REPLACED_BY_WATCH = new Set<string>(["/dashboard", "/jobs"]);

/** What a person's grants open, in rail order, and the Bricks link apart (a different company: navigation only). */
export function menuFor(apps: readonly string[]): { main: MenuLink[]; bricks: MenuLink[] } {
  const watch = apps.includes("watch");
  const rail: MenuLink[] = [
    // Watch is the Dashboard now (Aaron, 2026-09-28); the path stays /watch so links already sent keep working.
    ...(watch ? [["Dashboard", "/watch"] as const] : []),
    // Email, Time and Tasks have no grant: everyone has mail, hours, time off and tasks.
    ["Email", "/email"],
    // How C&C does its work, every trade and procedure with the manufacturer standards (SOP/, Aaron 10/18; named Academy 10/19, the path kept).
    // Admins only while it is built (Aaron, 2026-10-19); cc-app adds the "academy" grant (lib/library/access withAcademy).
    ...(apps.includes("academy") ? [["Academy", "/library/index.html"] as const] : []),
    ["Time", "/time"],
    ["Tasks", "/tasks"],
    ...MAIN.filter(([, h, app]) => apps.includes(app) && !(watch && REPLACED_BY_WATCH.has(h))).map(
      ([l, h]) => [l, h] as const,
    ),
  ];
  const main = rail.filter(([, h]) => !UNUSED.has(h));
  return { main, bricks: apps.includes("bricks") ? [["Bricks Hardware", "/bricks"]] : [] };
}

/** Dashboard matches itself only; every other link also lights for the pages under it. */
export function isCurrent(href: string, path: string): boolean {
  return href === "/dashboard" ? path === href : path === href || path.startsWith(`${href}/`);
}

/** The fold is kept in this browser under one key, so it holds as you cross from one app to the next. */
export const MENU_FOLD_KEY = "sh-fold";
