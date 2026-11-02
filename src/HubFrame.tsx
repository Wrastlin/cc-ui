"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AppFrame } from "./AppFrame";

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

/**
 * The rail for an app served under ccservicesapp.com from its own deployment (Subcontracts, Material orders).
 *
 * The person's grants come from the main app at /api/menu, same origin, so the sign-in cookie rides along. Anyone it
 * does not know (a crew member on a signing link, a page opened on the vercel.app address) gets the page with no rail.
 * The last answer is kept in this browser so the rail draws at once on the next page, then is checked again.
 *
 * Where the rail does not fit, the main app's phone tabs and Menu sheet take its place, so the menu is one tap away in
 * every app.
 */
export function HubFrame({ basePath, path, children }: { basePath: string; path: string; children: ReactNode }) {
  const [apps, setApps] = useState<string[] | null>(null);
  useEffect(() => {
    setApps(readJSON(APPS_KEY, isApps));
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
  if (!apps) return <>{children}</>;
  return (
    <AppFrame apps={apps} path={basePath + path} logoHref="/" extra={[["All apps", "/apps"]]}>
      {children}
    </AppFrame>
  );
}
