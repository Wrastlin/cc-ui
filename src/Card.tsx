"use client";

import { Children, Fragment, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode, type RefObject } from "react";
import { MoreHorizontal } from "lucide-react";
import Menu, { type MenuEntry } from "./ActionMenu";
import Button from "./Button";

// A card or row carries one action and one More (P3, Aaron 11/11: "cards with hundreds of buttons"). Shopify Polaris
// allows at most one primary action per card and puts row actions in one menu (Design-Lead/sources/
// mature-rules-2026-11-11.md). `action` is a single element, `more` is data, so a card with six buttons cannot be
// written: the rest go in `more`. The page budget gate (cc-app check-page-budget) measures what still slips through.

const DEV = process.env.NODE_ENV !== "production";
const BUTTONS = "button,[role=button],input[type=button],input[type=submit]";

/** More than one button besides the More (one passed in children, a Fragment passed as action) is a console.error. */
export function useOneAction(ref: RefObject<HTMLElement | null>, name: string) {
  useEffect(() => {
    if (!DEV || !ref.current) return;
    const n = ref.current.querySelectorAll(BUTTONS).length;
    if (n > 2) console.error(`"${name}" carries ${n} buttons: one action and one More (P3); move the rest into more.`);
  });
}

function single(action: ReactElement | null | undefined, name: string) {
  if (DEV && action && (Array.isArray(action) || (isValidElement(action) && action.type === Fragment))) {
    console.error(`"${name}": action takes one element; the rest go in more.`);
  }
}

/** The action slot: one action, then one More menu. For a hand-built row (a grid row) as for Card and Row. */
export function Actions({
  name,
  action,
  more,
  className,
}: {
  /** What the card or row is, for the More's label ("More for 22-830"). */
  name: string;
  action?: ReactElement | null;
  more?: readonly MenuEntry[];
  className?: string;
}) {
  single(action, name);
  if (!action && !more?.length) return null;
  return (
    <div className={["ui-acts", className].filter(Boolean).join(" ")}>
      {action}
      {more?.length ? <Menu aria-label={`More for ${name}`} icon={<MoreHorizontal size={18} aria-hidden="true" />} items={more} /> : null}
    </div>
  );
}

/**
 * The card's footer (Polaris card layout): a list action on the left (Add, Show more), at most two calls on the right,
 * anything further in `more`. A third call cannot be written: `calls` is a tuple of one or two.
 */
export type CardFooter = {
  list?: ReactElement | null;
  calls?: readonly [ReactElement] | readonly [ReactElement, ReactElement];
  more?: readonly MenuEntry[];
};

/**
 * A record on its own surface: title, a line under it, what it holds, and the action slot. A list of records is rows
 * (Row, RowList), not a wall of cards; a card is for a few records a person compares side by side.
 *
 * Header, body and footer each have one job. The header names the card and may carry one action; calls to action go
 * in the footer. `collapseAfter` shows that many children and a Show more in the footer's list slot.
 */
export default function Card({
  title,
  name: named,
  sub,
  children,
  action,
  more,
  footer,
  collapseAfter,
  className,
}: {
  title: ReactNode;
  /** The name for the More's label when title is not plain text. */
  name?: string;
  sub?: ReactNode;
  children?: ReactNode;
  action?: ReactElement | null;
  more?: readonly MenuEntry[];
  footer?: CardFooter;
  /** Show this many children, then Show more (Polaris: long lists collapse behind the footer). */
  collapseAfter?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const name = named ?? (typeof title === "string" ? title : "card");
  useOneAction(ref, name);
  const items = Children.toArray(children);
  const hidden = collapseAfter != null && items.length > collapseAfter ? items.length - collapseAfter : 0;
  const shown = hidden && !open ? items.slice(0, collapseAfter) : items;
  const toggle = hidden ? (
    <Button variant="text" size="sm" onClick={() => setOpen(!open)}>
      {open ? "Show fewer" : `Show ${hidden} more`}
    </Button>
  ) : null;
  const list = footer?.list ?? toggle;
  const calls = footer?.calls;
  const hasFoot = !!(list || calls?.length || footer?.more?.length);
  if (DEV && footer?.list && toggle) console.error(`"${name}": collapseAfter needs the footer's list slot; drop footer.list.`);
  return (
    <article ref={ref} className={["ui-card", className].filter(Boolean).join(" ")}>
      <div className="ui-card-head">
        <div className="ui-card-main">
          <h3 className="ui-card-title">{title}</h3>
          {sub ? <p className="ui-card-sub">{sub}</p> : null}
        </div>
        <Actions name={name} action={action} more={more} />
      </div>
      {shown.length ? <div className="ui-card-body">{shown}</div> : null}
      {hasFoot ? (
        <div className="ui-card-foot">
          <div className="ui-card-foot-list">{list}</div>
          <div className="ui-acts">
            {calls?.map((c, i) => <Fragment key={i}>{c}</Fragment>)}
            {footer?.more?.length ? (
              <Menu aria-label={`More for ${name}`} icon={<MoreHorizontal size={18} aria-hidden="true" />} items={footer.more} />
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}
