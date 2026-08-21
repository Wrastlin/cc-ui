"use client";

import Link from "next/link";
import type { ReactNode } from "react";

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

type RowProps = Common &
  (
    | { href: string; external?: boolean; onClick?: never }
    | { href?: undefined; external?: never; onClick?: () => void }
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

/** Groups rows into one hairline-separated block. */
export function RowGroup({
  children,
  label,
}: {
  children: ReactNode;
  label?: string;
}) {
  return (
    <nav className="ui-rows" aria-label={label}>
      {children}
    </nav>
  );
}
