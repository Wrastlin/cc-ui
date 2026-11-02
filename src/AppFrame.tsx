"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MENU_FOLD_KEY, type MenuLink } from "./menu";
import { MenuSheet, PhoneTabs } from "./PhoneMenu";
import { SideMenu } from "./SideMenu";

/**
 * The rail on a desk, the phone tabs and Menu sheet on a phone, around one page. The caller already knows the person's
 * grants: HubFrame fetches them for an app on its own deployment; cc-app's core layout reads them on the server.
 */
export function AppFrame({
  apps,
  path,
  logoHref = "/",
  extra,
  children,
}: {
  apps: readonly string[];
  path: string;
  logoHref?: string;
  extra?: readonly MenuLink[];
  children: ReactNode;
}) {
  const [folded, setFolded] = useState(false);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    try {
      setFolded(JSON.parse(localStorage.getItem(MENU_FOLD_KEY) ?? "false") === true);
    } catch {}
  }, []);
  const fold = (v: boolean) => {
    setFolded(v);
    try {
      localStorage.setItem(MENU_FOLD_KEY, JSON.stringify(v));
    } catch {}
  };
  return (
    <div className={`cc-frame${folded ? " cc-frame-folded" : ""}`}>
      <SideMenu apps={apps} path={path} folded={folded} onFold={fold} logoHref={logoHref} />
      <div className="cc-frame-main">{children}</div>
      <PhoneTabs apps={apps} path={path} onMenu={() => setMenu(true)} />
      <MenuSheet apps={apps} path={path} open={menu} onClose={() => setMenu(false)} extra={extra} />
    </div>
  );
}
