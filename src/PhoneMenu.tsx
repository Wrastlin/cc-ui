"use client";

import { Fragment, type ReactNode } from "react";
import { Menu } from "lucide-react";
import Button from "./Button";
import Sheet from "./Sheet";
import { MenuLinks, menuIcon, type MenuLinkProps } from "./SideMenu";

function Anchor({ href, current, children }: MenuLinkProps) {
  return (
    <a href={href} aria-current={current ? "page" : undefined}>
      {children}
    </a>
  );
}

/** The places used most, the same in every app: the Dashboard, Jobs for those who hold it, Tasks. */
export function phoneTabs(apps: readonly string[]): [label: string, href: string][] {
  return [
    ["Dashboard", apps.includes("watch") ? "/watch" : "/dashboard"],
    ...(apps.includes("dashboard") ? [["Jobs", "/jobs"] as [string, string]] : []),
    ["Tasks", "/tasks"],
  ];
}

/**
 * A phone's tabs float at the bottom, as on JobNimbus's app on Aaron's iPhone (jobnimbus-map/out/mobile-screens/
 * phone-01-home.png): the places used most in a pill, Menu last, and a round button beside it when the app has search.
 * Anything an app pins to the bottom of a phone screen sits --cc-phone-tabs-h up, or the pill covers it.
 */
export function PhoneTabs({
  apps, path, onMenu, renderLink = Anchor, search,
}: {
  apps: readonly string[];
  path: string;
  onMenu: () => void;
  renderLink?: (p: MenuLinkProps) => ReactNode;
  search?: ReactNode;
}) {
  return (
    <nav className="cc-phonetabs" aria-label="Main">
      <span className="cc-pill">
        {phoneTabs(apps).map(([label, href]) => {
          const Icon = menuIcon(href);
          return (
            <Fragment key={href}>
              {renderLink({
                href, label, folded: false, current: path === href || path.startsWith(`${href}/`),
                children: (
                  <>
                    {Icon && <Icon size={22} strokeWidth={1.75} aria-hidden />}
                    {label}
                  </>
                ),
              })}
            </Fragment>
          );
        })}
        <button type="button" onClick={onMenu}>
          <Menu size={22} strokeWidth={1.75} aria-hidden />
          Menu
        </button>
      </span>
      {search && <span className="cc-tabsearch">{search}</span>}
    </nav>
  );
}

/** Every link the rail shows, in a sheet. A tap on any link closes it on its way through. */
export function MenuSheet({
  apps, path, open, onClose, renderLink, extra,
}: {
  apps: readonly string[];
  path: string;
  open: boolean;
  onClose: () => void;
  renderLink?: (p: MenuLinkProps) => ReactNode;
  /** Links after the menu's own, such as the main app's All apps. */
  extra?: ReactNode;
}) {
  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Menu"
      footer={
        <Button variant="ghost" block onClick={onClose}>
          Close
        </Button>
      }
    >
      <div className="cc-sheet-menu" onClick={onClose}>
        <MenuLinks apps={apps} path={path} renderLink={renderLink} />
        {extra && <div className="cc-side-nav">{extra}</div>}
      </div>
    </Sheet>
  );
}
