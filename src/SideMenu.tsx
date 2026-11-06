"use client";

import type { ReactNode } from "react";
import {
  BookOpen, Briefcase, Droplets, Calculator, CalendarRange, ClipboardCheck, ClipboardList, Clock, Contact, FilePen,
  FileText, Files, FolderOpen, Gamepad2, GraduationCap, LayoutGrid, Layers, ListChecks, MapPin, Mic, Package,
  PanelLeftClose, PanelLeftOpen, Printer, QrCode, RotateCw, Ruler, Scale, Store, Upload, Home, ShieldCheck, Building2,
  FileStack, type LucideIcon,
} from "lucide-react";
import Button from "./Button";
import { isCurrent, menuSections, type MenuLink } from "./menu";

// A folded rail is these alone, so each link keeps one beside its name.
const ICON: Record<string, LucideIcon> = {
  "/time": Clock, "/tasks": ListChecks, "/inventory/upload": Upload,
  "/jobs": Briefcase, "/checks": Scale, "/contacts": Contact, "/zoho": BookOpen,
  "/forms": ClipboardList,
  "/pdf": FileText, "/templates": Files, "/production": CalendarRange, "/gutters": Droplets, "/folders": FolderOpen,
  "/admin": ClipboardCheck, "/canvass": MapPin, "/inspection-rotation": RotateCw, "/subcontracts": FilePen,
  "/inventory/buy": Package, "/inventory/shop": QrCode, "/inventory/shop/print": Printer, "/estimating/queue": Calculator, "/commercial": Ruler,
  "/panels": Layers, "/sim": Gamepad2, "/bricks": Store, "/library/index.html": GraduationCap, "/record": Mic,
  "/apps": LayoutGrid,
  "/core/estimating": Calculator, "/core/estimating?p=residential": Home, "/core/estimating?p=insurance": ShieldCheck,
  "/core/estimating?p=commercial": Building2, "/core/estimating?p=plan_bid": FileStack,
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
  const sections = menuSections(apps);
  const draw = drawLink(path, folded, renderLink);
  // A category heading opens its section page; its tools sit under it, so every one is a tap from anywhere.
  return (
    <>
      {sections.map((s) => (
        <div key={s.id} className="cc-side-section">
          {renderLink({
            href: s.href,
            label: s.title,
            folded,
            current: path === s.href,
            children: <span className="cc-side-navhead">{s.title}</span>,
          })}
          <div className="cc-side-nav">{s.links.map(draw)}</div>
        </div>
      ))}
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
          <a className="cc-side-logo" href={logoHref} aria-label="C&C Services home">
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
