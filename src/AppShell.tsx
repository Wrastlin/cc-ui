"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { AppBar } from "./AppBar";
import { MenuSheet } from "./PhoneMenu";

// The one shell every C&C repo imports (gap 3b; Carbon UI shell: "persistent throughout the product experience").
// Aaron: "we lose the header when we scroll" (11/04), "new apps we build dont use the left side menu ... dont allow us
// to get back to the main app" (11/09), "the three bars should display the total nav menu ... and the c&c logo that
// sends us home" (11/20), "keep buttons and features fixed at the top" (11/20).
// One sticky bar at every width: Back with the parent's name when the page has a parent, else the menu button; the logo
// goes home; trailing in a fixed order, the page's create, its More, then the Helper and the bell. The menu is one
// Sheet at every width, never a left sidebar. No bottom bar. On a phone the product name and the account leave the
// bar (the logo goes home; the account opens from the top of the menu), so it holds four icons at most.

type Bar = ComponentProps<typeof AppBar>;

export function AppShell({
  back,
  product,
  hubHref,
  create,
  more,
  helper,
  bell,
  account,
  apps,
  path,
  menuExtra,
  renderLink,
  children,
}: {
  back?: Bar["back"];
  product: Bar["product"];
  hubHref?: string;
  /** The page's one create, as data; the bar sizes it (an icon alone on a phone). */
  create?: Bar["action"];
  more?: Bar["more"];
  helper?: ReactNode;
  bell?: ReactNode;
  account?: ReactNode;
  /** The menu's apps and the current path, as MenuSheet takes them. */
  apps: ComponentProps<typeof MenuSheet>["apps"];
  path: string;
  menuExtra?: ComponentProps<typeof MenuSheet>["extra"];
  renderLink?: ComponentProps<typeof MenuSheet>["renderLink"];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="cc-shell-frame">
      <AppBar
        back={back}
        product={product}
        hubHref={hubHref}
        action={create}
        more={more}
        helper={helper}
        bell={bell}
        account={account ? <span className="cc-shell-account">{account}</span> : undefined}
        onMenu={() => setOpen(true)}
      />
      <MenuSheet apps={apps} path={path} open={open} onClose={() => setOpen(false)} extra={menuExtra} renderLink={renderLink} account={account} />
      <div className="cc-shell-page">{children}</div>
    </div>
  );
}
