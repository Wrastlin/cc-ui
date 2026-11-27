"use client";
// Ours, on React Aria's RadioGroup (Apache-2.0), styled to match the adapted Checkbox beside it.

import type { ReactNode } from "react";
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps,
  type ValidationResult,
} from "react-aria-components";
import { cx, withClass } from "./cx";
import { Description, FieldError, Label } from "./Field";

// One answer from a short set (gap 14; P1: 2 to 5 choices are shown, 6 to 15 a Select, 16 or more a ComboBox). The
// group's name is its label, the likely answer goes first, the whole row is the target (48 px on a phone), and an
// error belongs to the group, not one option.

const row =
  "group flex min-h-(--cc-ctl-h) cursor-default items-center gap-3 text-cc-body text-cc-text data-disabled:text-cc-faint";
const dot = cx(
  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 border-solid border-cc-border bg-cc-bg",
  "group-data-selected:border-cc-accent group-data-pressed:border-cc-accent-press group-data-invalid:border-cc-danger group-data-disabled:border-cc-line",
  "group-data-focus-visible:outline-3 group-data-focus-visible:outline-solid group-data-focus-visible:outline-offset-3 group-data-focus-visible:outline-cc-accent",
);

export function Radio(props: RadioProps & { children?: ReactNode }) {
  return (
    <AriaRadio {...props} className={withClass(props.className, row)}>
      {({ isSelected }) => (
        <>
          <span className={dot} aria-hidden>
            {isSelected ? <span className="size-2.5 rounded-full bg-cc-accent" /> : null}
          </span>
          {props.children}
        </>
      )}
    </AriaRadio>
  );
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children"> {
  label: string;
  description?: string;
  errorMessage?: string | ((v: ValidationResult) => string);
  children: ReactNode;
}

export function RadioGroup({ label, description, errorMessage, children, ...props }: RadioGroupProps) {
  if (process.env.NODE_ENV !== "production") {
    const n = Array.isArray(children) ? children.length : 1;
    if (n > 5) console.error(`RadioGroup "${label}": ${n} choices; over 5 is a Select (P1).`);
  }
  return (
    <AriaRadioGroup {...props} className={withClass(props.className, "flex flex-col gap-1")}>
      <Label>{label}</Label>
      <div className="flex flex-col">{children}</div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}
