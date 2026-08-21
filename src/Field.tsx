"use client";

import type { ReactNode } from "react";

// A labelled control.
//
// The audit found a "FEATURE" label sitting over the severity buttons with no
// control under it, because the select had borrowed a class that was
// display:none. A Field owns its label AND its control, so a label without a
// control is not a shape you can accidentally build.
//
// The control itself is sized from the same tokens as Button, so an input next
// to a button is the same height instead of two guesses.

type FieldProps = {
  label: string;
  /** Said quietly under the control — a hint, or what went wrong. */
  help?: ReactNode;
  /** Marks the label and hands the control aria-invalid. */
  error?: boolean;
  children: ReactNode;
  className?: string;
};

export default function Field({
  label,
  help,
  error,
  children,
  className,
}: FieldProps) {
  return (
    <label
      className={["ui-field", error ? "ui-field-err" : "", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ui-field-label">{label}</span>
      {children}
      {help ? <span className="ui-field-help">{help}</span> : null}
    </label>
  );
}

/** A text input already carrying the control sizing. */
export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={["ui-input", className ?? ""].filter(Boolean).join(" ")}
    />
  );
}

/** A select already carrying the control sizing. */
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select
      {...rest}
      className={["ui-input", "ui-select", className ?? ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </select>
  );
}
