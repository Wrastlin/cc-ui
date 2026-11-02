"use client";
// Adapted from Adobe's React Aria Tailwind starter (react-spectrum/starters/tailwind), Apache-2.0: LICENSES/.

import type { ReactNode } from "react";
import {
  FieldError as AriaFieldError,
  Group,
  Input as AriaInput,
  Label as AriaLabel,
  Text,
  type FieldErrorProps,
  type GroupProps,
  type InputProps,
  type LabelProps,
} from "react-aria-components";
import { controlBox, cx, focusRing, withClass } from "./cx";

/** A field's name. Always shown, never a placeholder in its place. */
export function Label(props: LabelProps) {
  return <AriaLabel {...props} className={cx("w-fit text-cc-meta font-medium text-cc-muted", props.className)} />;
}

export function Description({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Text slot="description" className={cx("text-cc-meta text-cc-muted", className)}>
      {children}
    </Text>
  );
}

/** The error line, linked to the field by React Aria so a screen reader reads it with the field. */
export function FieldError(props: FieldErrorProps) {
  return <AriaFieldError {...props} className={withClass(props.className, "text-cc-meta font-medium text-cc-danger")} />;
}

/** The box around an input and its buttons: the field's edge goes navy while anything inside has focus. */
export function FieldGroup(props: GroupProps) {
  return (
    <Group
      {...props}
      className={withClass(
        props.className,
        cx(
          controlBox,
          "flex items-center overflow-hidden data-focus-within:border-cc-accent data-invalid:border-cc-danger data-disabled:bg-cc-panel-2",
        ),
      )}
    />
  );
}

export function Input(props: InputProps) {
  return (
    <AriaInput
      {...props}
      className={withClass(
        props.className,
        "min-w-0 flex-1 self-stretch border-0 bg-transparent px-3 text-cc-input text-cc-text outline-none placeholder:text-cc-faint disabled:text-cc-muted",
      )}
    />
  );
}

export const fieldButton = cx(
  focusRing,
  "flex h-full min-w-(--cc-ctl-h) cursor-default items-center justify-center border-0 bg-transparent text-cc-muted data-hovered:text-cc-text data-pressed:bg-cc-selected",
);
