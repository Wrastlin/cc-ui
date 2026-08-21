"use client";

import Link from "next/link";
import type { ReactNode } from "react";

// The one button.
//
// `.btn` still exists and 24 surfaces re-specify its padding, which is why the
// same class measured 34, 38, 40, 44 and 48px in a single screen. This uses a
// `ui-` namespace precisely so nothing can reach in and disagree: there is no
// existing rule anywhere that targets it.
//
// It closes the three traps at the source, so no call site has to remember:
//   · the 44px floor comes from --ctl-h / --ctl-h-sm, never a literal
//   · the label sits in a min-width:0 slot, so text truncates instead of
//     pushing out of the box (a flex item's default min-width is auto, which
//     is what put "Cody house new test1101 Yawkey Ave" on screen)
//   · one radius, one type size, per size

export type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonSize = "md" | "sm";

type Common = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading glyph. Never becomes the whole button unless `label` is omitted. */
  icon?: ReactNode;
  /** Trailing content — a count, a chevron. Never shrinks. */
  trailing?: ReactNode;
  /** Fills its container instead of hugging its label. */
  block?: boolean;
  children?: ReactNode;
  className?: string;
};

type AsButton = Common & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  title?: string;
  "aria-label"?: string;
};

type AsLink = Common & {
  href: string;
  external?: boolean;
  title?: string;
  "aria-label"?: string;
};

function classes({
  variant = "ghost",
  size = "md",
  block,
  icon,
  children,
  className,
}: Common) {
  return [
    "ui-btn",
    `ui-btn-${variant}`,
    `ui-btn-${size}`,
    block ? "ui-btn-block" : "",
    icon && !children ? "ui-btn-icon" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

function Inner({ icon, children, trailing }: Common) {
  return (
    <>
      {icon ? (
        <span className="ui-btn-glyph" aria-hidden>
          {icon}
        </span>
      ) : null}
      {children ? <span className="ui-btn-label">{children}</span> : null}
      {trailing ? <span className="ui-btn-trail">{trailing}</span> : null}
    </>
  );
}

export default function Button(props: AsButton | AsLink) {
  if ("href" in props && props.href) {
    const { href, external, title } = props;
    const label = props["aria-label"];
    if (external) {
      return (
        <a
          className={classes(props)}
          href={href}
          target="_blank"
          rel="noreferrer"
          title={title}
          aria-label={label}
        >
          <Inner {...props} />
        </a>
      );
    }
    return (
      <Link className={classes(props)} href={href} title={title} aria-label={label}>
        <Inner {...props} />
      </Link>
    );
  }
  const p = props as AsButton;
  return (
    <button
      type={p.type ?? "button"}
      className={classes(props)}
      onClick={p.onClick}
      disabled={p.disabled}
      title={p.title}
      aria-label={p["aria-label"]}
    >
      <Inner {...props} />
    </button>
  );
}
