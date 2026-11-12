"use client";

import Link from "next/link";
import { useRef, type ReactElement, type ReactNode } from "react";
import type { MenuEntry } from "./ActionMenu";
import { Actions, useOneAction } from "./Card";

// A quiet list row: glyph · title over subtitle · trailing.
//
// This is the shape the app keeps re-drawing by hand — the job hub
// destinations, the event list, the standards rail — and every hand-rolled
// copy has to remember min-width:0 or the subtitle pushes the trailing content
// off the end. It remembers here instead.
//
// Rows are the alternative to wrapping everything in a card. Nine cards of
// equal weight say nothing about what matters; rows say "these are
// destinations, the thing above them is the point".

type Common = {
  icon?: ReactNode;
  title: ReactNode;
  /** One line under the title. Truncates rather than pushing the row wider. */
  sub?: ReactNode;
  /** A chevron, a count, a status. Never shrinks. */
  trailing?: ReactNode;
  className?: string;
};

// The row's own target (href, onClick) is its one action, so `action` is only for a row that is not one; `more` is the
// one More menu beside either (P3). A third control cannot be passed.
type RowProps = Common & { more?: readonly MenuEntry[] } &
  (
    | { href: string; external?: boolean; onClick?: never; action?: never }
    | { href?: undefined; external?: never; onClick?: () => void; action?: never }
    | { href?: undefined; external?: never; onClick?: undefined; action: ReactElement }
  );

function Body({ icon, title, sub, trailing }: Common) {
  return (
    <>
      {icon ? (
        <span className="ui-row-glyph" aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className="ui-row-main">
        <span className="ui-row-title">{title}</span>
        {sub ? <span className="ui-row-sub">{sub}</span> : null}
      </span>
      {trailing ? <span className="ui-row-trail">{trailing}</span> : null}
    </>
  );
}

export default function Row(props: RowProps) {
  if (props.action || props.more?.length) return <SplitRow {...props} />;
  const cls = ["ui-row", props.className ?? ""].filter(Boolean).join(" ");
  if (props.href && props.external) {
    return (
      <a className={cls} href={props.href} target="_blank" rel="noreferrer">
        <Body {...props} />
      </a>
    );
  }
  if (props.href) {
    return (
      <Link className={cls} href={props.href}>
        <Body {...props} />
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={props.onClick}>
      <Body {...props} />
    </button>
  );
}

/** A row with an action slot: the row's own target, then its action or More beside it, never nested in the link. */
function SplitRow(props: RowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const name = typeof props.title === "string" ? props.title : "row";
  useOneAction(ref, name);
  const body = <Body {...props} />;
  const hit = props.href && props.external ? (
    <a className="ui-row-hit" href={props.href} target="_blank" rel="noreferrer">{body}</a>
  ) : props.href ? (
    <Link className="ui-row-hit" href={props.href}>{body}</Link>
  ) : props.onClick ? (
    <button type="button" className="ui-row-hit" onClick={props.onClick}>{body}</button>
  ) : (
    <div className="ui-row-hit">{body}</div>
  );
  return (
    <div ref={ref} className={["ui-row ui-row-split", props.className ?? ""].filter(Boolean).join(" ")}>
      {hit}
      <Actions name={name} action={props.action} more={props.more} />
    </div>
  );
}

/** Groups rows into one hairline-separated block. A group, not a nav landmark: a page holds many of them. */
export function RowGroup({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <div className="ui-rows" role="group" aria-label={label}>
      {children}
    </div>
  );
}
