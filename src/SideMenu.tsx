"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen, Briefcase, Calculator, CalendarRange, ClipboardCheck, ClipboardList, Clock, Contact, DollarSign, FilePen,
  FileText, Files, FolderOpen, Gamepad2, LayoutDashboard, Layers, ListChecks, Mail, MapPin, Megaphone, Package,
  PanelLeftClose, PanelLeftOpen, QrCode, RotateCw, Ruler, Store, Users, type LucideIcon,
} from "lucide-react";
import Button from "./Button";
import { MENU_FOLD_KEY, isCurrent, menuFor, type MenuLink } from "./menu";

// A folded rail is these alone, so each link keeps one beside its name.
const ICON: Record<string, LucideIcon> = {
  "/watch": LayoutDashboard, "/email": Mail, "/time": Clock, "/tasks": ListChecks, "/dashboard": LayoutDashboard,
  "/jobs": Briefcase, "/money": DollarSign, "/contacts": Contact, "/zoho": BookOpen, "/forms": ClipboardList,
  "/pdf": FileText, "/templates": Files, "/review": Users, "/production": CalendarRange, "/folders": FolderOpen,
  "/admin": ClipboardCheck, "/canvass": MapPin, "/inspection-rotation": RotateCw, "/subcontracts": FilePen,
  "/inventory/buy": Package, "/inventory/shop": QrCode, "/estimating/queue": Calculator, "/commercial": Ruler,
  "/panels": Layers, "/marketing": Megaphone, "/sim": Gamepad2, "/bricks": Store,
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
export function MenuLinks({
  apps, path, folded = false, renderLink = Anchor,
}: {
  apps: readonly string[];
  path: string;
  folded?: boolean;
  renderLink?: (p: MenuLinkProps) => ReactNode;
}) {
  const { main, bricks } = menuFor(apps);
  const draw = ([label, href]: MenuLink) => {
    const Icon = ICON[href];
    return (
      <span key={href} style={{ display: "contents" }}>
        {renderLink({
          href, label, folded, current: isCurrent(href, path),
          children: (
            <>
              {Icon && <Icon size={16} strokeWidth={1.75} aria-hidden />}
              <span className="sh-label">{label}</span>
            </>
          ),
        })}
      </span>
    );
  };
  return (
    <>
      <div className="sh-nav">{main.map(draw)}</div>
      {bricks.length > 0 && (
        <>
          <div className="sh-navhead">Bricks</div>
          <div className="sh-nav">{bricks.map(draw)}</div>
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
    <nav className="sh-side">
      <div className="sh-head">
        {logo ?? (
          <a className="sh-logo" href={logoHref}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/cc-logo.svg" alt="C&C Services" />
          </a>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="sh-fold"
          icon={folded ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          aria-label={folded ? "Open the menu" : "Fold the menu"}
          title={folded ? "Open the menu" : "Fold the menu"}
          onClick={() => onFold(!folded)}
        />
      </div>
      <div className="sh-rail">
        <MenuLinks apps={apps} path={path} folded={folded} renderLink={renderLink} />
      </div>
      {children}
      <div className="sh-foot">
        <b>C&amp;C Services</b>
        Wausau, WI
      </div>
    </nav>
  );
}

const APPS_KEY = "cc-menu-apps";

function readJSON<T>(key: string, ok: (v: unknown) => v is T): T | null {
  try {
    const raw = localStorage.getItem(key);
    const v: unknown = raw === null ? null : JSON.parse(raw);
    return ok(v) ? v : null;
  } catch {
    return null;
  }
}
const isApps = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === "string");
const isBool = (v: unknown): v is boolean => typeof v === "boolean";

/**
 * The rail for an app served under ccservicesapp.com from its own deployment (Subcontracts, Material orders).
 *
 * The person's grants come from the main app at /api/menu, same origin, so the sign-in cookie rides along. Anyone it
 * does not know (a crew member on a signing link, a page opened on the vercel.app address) gets the page with no rail.
 * The last answer is kept in this browser so the rail draws at once on the next page, then is checked again.
 */
export function HubFrame({ basePath, path, children }: { basePath: string; path: string; children: ReactNode }) {
  const [apps, setApps] = useState<string[] | null>(null);
  const [folded, setFolded] = useState(false);
  useEffect(() => {
    setApps(readJSON(APPS_KEY, isApps));
    setFolded(readJSON(MENU_FOLD_KEY, isBool) ?? false);
    let live = true;
    // A whole URL as a string: an app that prefixes its own basePath onto "/..." fetches (Material orders'
    // BasePathBoot) leaves it alone.
    fetch(`${window.location.origin}/api/menu`, { credentials: "same-origin", cache: "no-store" })
      .then(async (r) => {
        const body: unknown = r.ok ? await r.json() : null;
        const next = body && typeof body === "object" && isApps((body as { apps?: unknown }).apps)
          ? (body as { apps: string[] }).apps
          : null;
        if (!live) return;
        setApps(next);
        try {
          if (next) localStorage.setItem(APPS_KEY, JSON.stringify(next));
          else localStorage.removeItem(APPS_KEY);
        } catch {}
      })
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);
  const fold = (v: boolean) => {
    setFolded(v);
    try {
      localStorage.setItem(MENU_FOLD_KEY, JSON.stringify(v));
    } catch {}
  };
  if (!apps) return <>{children}</>;
  return (
    <div className={`cc-frame${folded ? " cc-frame-folded" : ""}`}>
      <SideMenu apps={apps} path={basePath + path} folded={folded} onFold={fold} logoHref={apps.includes("watch") ? "/watch" : "/"} />
      <div className="cc-frame-main">{children}</div>
    </div>
  );
}
