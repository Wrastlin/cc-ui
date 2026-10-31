"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Button as AriaButton, type PressEvent } from "react-aria-components";

// The one button.
//
// `.btn` still exists and 24 surfaces re-specify its padding, which is why the
// same class measured 34, 38, 40, 44 and 48px in a single screen. This uses a
// `ui-` namespace precisely so nothing can reach in and disagree: there is no
// existing rule anywhere that targets it.
//
// It closes the three traps at the source, so no call site has to remember:
//   · the 48px phone floor comes from --ctl-h / --ctl-h-sm, never a literal
//   · the label sits in a min-width:0 slot, so text truncates instead of
//     pushing out of the box (a flex item's default min-width is auto, which
//     is what put "Cody house new test1101 Yawkey Ave" on screen)
//   · one radius, one type size, per size
//
// The <button> is React Aria's: press, hover and focus-visible arrive as
// data-pressed, data-hovered and data-focus-visible, so a phone gets a press
// state and never a hover stuck on after the finger lifts. Links stay plain
// anchors; React Aria's press handling is for buttons.

/** secondary is the visual system's name for ghost (a white button with a real edge); text is an action with no box. */
export type ButtonVariant = "primary" | "secondary" | "ghost" | "text" | "danger";
/** sm and md are 48px on a phone (--cc-ctl-h); lg is the 56px primary target (--cc-ctl-h-lg). */
export type ButtonSize = "md" | "sm" | "lg";

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
  /** The error line under a field this button sets. */
  "aria-describedby"?: string;
  /** One of a set of choices: the picked one reads as picked without competing with the screen's primary action. */
  pressed?: boolean;
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
    <AriaButton
      type={p.type ?? "button"}
      className={classes(props)}
      onPress={p.onClick ? () => p.onClick?.() : undefined}
      onPressStart={keepBubbling}
      onPressUp={keepBubbling}
      onPressEnd={keepBubbling}
      isDisabled={p.disabled}
      aria-label={p["aria-label"]}
      aria-describedby={p["aria-describedby"]}
      aria-pressed={p.pressed}
      render={p.title ? (attrs) => <button {...attrs} title={p.title} /> : undefined}
    >
      <Inner {...props} />
    </AriaButton>
  );
}

// React Aria stops press events at the button by default. A native button let
// them bubble, and callers lean on that (a row that also listens, a menu that
// closes on any click), so they keep bubbling.
function keepBubbling(e: PressEvent) {
  e.continuePropagation();
}
