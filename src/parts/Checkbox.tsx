"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import { Check, Minus } from "lucide-react";
import type { ReactNode } from "react";
import {
  Checkbox as AriaCheckbox,
  CheckboxGroup as AriaCheckboxGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps,
  type ValidationResult,
} from "react-aria-components";
import { cx, withClass } from "./cx";
import { Description, FieldError, Label } from "./Field";

const row =
  "group flex min-h-(--cc-ctl-h) cursor-default items-center gap-3 text-cc-body text-cc-text data-disabled:text-cc-faint";
const box = cx(
  "flex size-5 shrink-0 items-center justify-center rounded-cc-sm border-2 border-solid border-cc-border bg-cc-bg text-cc-bg",
  "group-data-selected:border-cc-accent group-data-selected:bg-cc-accent group-data-indeterminate:border-cc-accent group-data-indeterminate:bg-cc-accent",
  "group-data-pressed:border-cc-accent-press group-data-invalid:border-cc-danger group-data-disabled:border-cc-line",
  "group-data-focus-visible:outline-3 group-data-focus-visible:outline-solid group-data-focus-visible:outline-offset-3 group-data-focus-visible:outline-cc-accent",
);

/** A box and its words; the whole row is the target, 48px tall on a phone. */
export function Checkbox(props: CheckboxProps & { children?: ReactNode }) {
  return (
    <AriaCheckbox {...props} className={withClass(props.className, row)}>
      {composeRenderProps(props.children, (children, { isSelected, isIndeterminate }) => (
        <>
          <span className={box} aria-hidden>
            {isIndeterminate ? <Minus size={14} strokeWidth={3} /> : isSelected ? <Check size={14} strokeWidth={3} /> : null}
          </span>
          {children}
        </>
      ))}
    </AriaCheckbox>
  );
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((v: ValidationResult) => string);
  children: ReactNode;
}

export function CheckboxGroup({ label, description, errorMessage, children, ...props }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={withClass(props.className, "flex flex-col gap-1")}>
      {label && <Label>{label}</Label>}
      <div className="flex flex-col">{children}</div>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}
