"use client";

import type { ReactNode } from "react";
import {
  BookOpen, Briefcase, Droplets, Calculator, CalendarRange, ClipboardCheck, ClipboardList, Clock, Contact, DollarSign, FilePen,
  FileText, Files, FolderOpen, Gamepad2, GraduationCap, LayoutDashboard, LayoutGrid, Layers, ListChecks, ListTodo, Mail, MapPin, Megaphone, Mic, MoreHorizontal, Package,
  PanelLeftClose, PanelLeftOpen, Printer, QrCode, RotateCw, Ruler, Scale, Store, Upload, Users, type LucideIcon,
} from "lucide-react";
import Button from "./Button";
import { isCurrent, menuFor, type MenuLink } from "./menu";

// A folded rail is these alone, so each link keeps one beside its name.
const ICON: Record<string, LucideIcon> = {
  "/watch": LayoutDashboard, "/email": Mail, "/time": Clock, "/tasks": ListChecks, "/inventory/upload": Upload, "/dashboard": LayoutDashboard,
  "/jobs": Briefcase, "/money": DollarSign, "/checks": Scale, "/contacts": Contact, "/zoho": BookOpen,
  "/forms": ClipboardList,
  "/pdf": FileText, "/templates": Files, "/review": Users, "/production": CalendarRange, "/status": ListTodo, "/gutters": Droplets, "/folders": FolderOpen,
  "/admin": ClipboardCheck, "/canvass": MapPin, "/inspection-rotation": RotateCw, "/subcontracts": FilePen,
  "/inventory/buy": Package, "/inventory/shop": QrCode, "/inventory/shop/print": Printer, "/estimating/queue": Calculator, "/commercial": Ruler,
  "/panels": Layers, "/marketing": Megaphone, "/sim": Gamepad2, "/bricks": Store, "/library/index.html": GraduationCap, "/record": Mic,
  "/apps": LayoutGrid,
};

export function menuIcon(href: string): LucideIcon | undefined {
  return ICON[href];
}

export type MenuLinkProps = {
  href: string;
  label: string;
  current: boolean;
  folded: boolean;
  children: ReactNode;
};

/** A plain anchor: another app's page is a full load anyway, and an anchor is not rewritten by a basePath. */
function Anchor({ href, label, current, folded, children }: MenuLinkProps) {
  return (
    <a href={href} aria-current={current ? "page" : undefined} title={folded ? label : undefined}>
      {children}
    </a>
  );
}

/** The links alone: the rail draws them, and a phone's menu sheet draws the same ones. */
function drawLink(path: string, folded: boolean, renderLink: (p: MenuLinkProps) => ReactNode) {
  return function draw([label, href]: MenuLink) {
    const Icon = ICON[href];
    return (
      <span key={href} style={{ display: "contents" }}>
        {renderLink({
          href, label, folded, current: isCurrent(href, path),
          children: (
            <>
              {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden />}
              <span className="cc-side-label">{label}</span>
            </>
          ),
        })}
      </span>
    );
  };
}

/** Links an app adds after the menu's own (the main app's All apps), drawn on the same icon and label grid. */
export function ExtraLinks({
  links, path, renderLink = Anchor,
}: {
  links: readonly MenuLink[];
  path: string;
  renderLink?: (p: MenuLinkProps) => ReactNode;
}) {
  return <div className="cc-side-nav">{links.map(drawLink(path, false, renderLink))}</div>;
}

export function MenuLinks({
  apps, path, folded = false, renderLink = Anchor,
}: {
  apps: readonly string[];
  path: string;
  folded?: boolean;
  renderLink?: (p: MenuLinkProps) => ReactNode;
}) {
  const { main, more, bricks } = menuFor(apps);
  const inMore = more.some(([, h]) => isCurrent(h, path));
  const draw = drawLink(path, folded, renderLink);
  return (
    <>
      <div className="cc-side-nav">{main.map(draw)}</div>
      {more.length > 0 && (
        <details className="cc-side-more" open={inMore || undefined}>
          <summary title={folded ? "More" : undefined}>
            <MoreHorizontal size={16} strokeWidth={1.75} aria-hidden />
            <span className="cc-side-label">More</span>
          </summary>
          <div className="cc-side-nav">{more.map(draw)}</div>
        </details>
      )}
      {bricks.length > 0 && (
        <>
          <div className="cc-side-navhead">Bricks</div>
          <div className="cc-side-nav">{bricks.map(draw)}</div>
        </>
      )}
    </>
  );
}

/** The rail: the logo, the fold, the links, and the company line at the foot. */
export function SideMenu({
  apps, path, folded, onFold, logoHref, renderLink, logo, children,
}: {
  apps: readonly string[];
  path: string;
  folded: boolean;
  onFold: (folded: boolean) => void;
  logoHref: string;
  renderLink?: (p: MenuLinkProps) => ReactNode;
  /** The logo link, when the app draws its own (a Next Link). */
  logo?: ReactNode;
  /** Whatever the app shows in the rail's place on a phone. */
  children?: ReactNode;
}) {
  return (
    <nav className="cc-side">
      <div className="cc-side-head">
        {logo ?? (
          <a className="cc-side-logo" href={logoHref}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cc-logo.svg" alt="C&C Services" />
          </a>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="cc-side-fold"
          icon={folded ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          aria-label={folded ? "Open the menu" : "Fold the menu"}
          title={folded ? "Open the menu" : "Fold the menu"}
          onClick={() => onFold(!folded)}
        />
      </div>
      <div className="cc-side-rail">
        <MenuLinks apps={apps} path={path} folded={folded} renderLink={renderLink} />
      </div>
      {children}
      <div className="cc-side-foot">
        <b>C&amp;C Services</b>
        Wausau, WI
      </div>
    </nav>
  );
}
